import pytest
import asyncio
import threading
import time
from unittest.mock import Mock, patch, AsyncMock
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import asynccontextmanager


class MockConnection:
    """Mock database connection for testing"""
    def __init__(self, connection_id):
        self.connection_id = connection_id
        self.is_closed = False
        self.in_use = False
        self.created_at = time.time()
    
    def close(self):
        self.is_closed = True
        self.in_use = False
    
    def execute(self, query):
        if self.is_closed:
            raise Exception("Connection is closed")
        return f"Result for {query}"


class MockDatabasePool:
    """Mock database connection pool with configurable behavior"""
    def __init__(self, max_connections=5, connection_timeout=1.0):
        self.max_connections = max_connections
        self.connection_timeout = connection_timeout
        self.available_connections = []
        self.active_connections = set()
        self.connection_counter = 0
        self._lock = threading.RLock()
        self._condition = threading.Condition(self._lock)
        self.is_closed = False
    
    def get_connection(self, timeout=None):
        """Get a connection from the pool with timeout"""
        timeout = timeout or self.connection_timeout
        start_time = time.time()
        
        with self._condition:
            while True:
                if self.is_closed:
                    raise Exception("Pool is closed")
                
                # Try to get an available connection
                if self.available_connections:
                    conn = self.available_connections.pop()
                    conn.in_use = True
                    self.active_connections.add(conn)
                    return conn
                
                # Create new connection if under limit
                if len(self.active_connections) < self.max_connections:
                    conn = MockConnection(self.connection_counter)
                    self.connection_counter += 1
                    conn.in_use = True
                    self.active_connections.add(conn)
                    return conn
                
                # Wait for connection to become available
                elapsed = time.time() - start_time
                if elapsed >= timeout:
                    raise TimeoutError(f"Failed to get connection within {timeout}s")
                
                remaining_timeout = timeout - elapsed
                self._condition.wait(remaining_timeout)
    
    def return_connection(self, connection):
        """Return a connection to the pool"""
        with self._condition:
            if connection in self.active_connections:
                connection.in_use = False
                self.active_connections.remove(connection)
                if not connection.is_closed and not self.is_closed:
                    self.available_connections.append(connection)
                self._condition.notify_all()
    
    def close_all(self):
        """Close all connections and the pool"""
        with self._condition:
            self.is_closed = True
            for conn in list(self.active_connections):
                conn.close()
            for conn in self.available_connections:
                conn.close()
            self.active_connections.clear()
            self.available_connections.clear()
            self._condition.notify_all()
    
    @property
    def active_count(self):
        with self._lock:
            return len(self.active_connections)
    
    @property
    def available_count(self):
        with self._lock:
            return len(self.available_connections)


class TestDatabasePoolExhaustion:
    """Test suite for database connection pool exhaustion scenarios"""
    
    @pytest.fixture
    def pool(self):
        """Create a fresh pool for each test"""
        pool = MockDatabasePool(max_connections=3, connection_timeout=0.5)
        yield pool
        pool.close_all()
    
    @pytest.fixture
    def large_pool(self):
        """Create a larger pool for stress tests"""
        pool = MockDatabasePool(max_connections=10, connection_timeout=2.0)
        yield pool
        pool.close_all()
    
    def test_pool_exhaustion_timeout(self, pool):
        """Test that pool exhaustion raises TimeoutError"""
        connections = []
        
        try:
            # Exhaust the pool
            for i in range(pool.max_connections):
                conn = pool.get_connection()
                connections.append(conn)
            
            # Next request should timeout
            with pytest.raises(TimeoutError, match="Failed to get connection within"):
                pool.get_connection(timeout=0.1)
        
        finally:
            # Clean up connections
            for conn in connections:
                pool.return_connection(conn)
    
    def test_pool_recovery_after_return(self, pool):
        """Test that pool recovers after connections are returned"""
        connections = []
        
        try:
            # Exhaust the pool
            for i in range(pool.max_connections):
                conn = pool.get_connection()
                connections.append(conn)
            
            assert pool.active_count == pool.max_connections
            assert pool.available_count == 0
            
            # Return one connection
            pool.return_connection(connections.pop())
            
            # Should be able to get a connection now
            new_conn = pool.get_connection(timeout=0.1)
            assert new_conn is not None
            connections.append(new_conn)
        
        finally:
            for conn in connections:
                pool.return_connection(conn)
    
    def test_concurrent_connection_requests(self, pool):
        """Test concurrent requests with proper synchronization"""
        results = []
        errors = []
        
        def get_connection_worker(worker_id):
            try:
                conn = pool.get_connection(timeout=1.0)
                time.sleep(0.1)  # Simulate work
                pool.return_connection(conn)
                results.append(f"Worker {worker_id} succeeded")
            except Exception as e:
                errors.append(f"Worker {worker_id} failed: {e}")
        
        # Start more workers than pool capacity
        with ThreadPoolExecutor(max_workers=6) as executor:
            futures = [executor.submit(get_connection_worker, i) for i in range(6)]
            
            # Wait for all to complete with timeout
            for future in as_completed(futures, timeout=5.0):
                future.result()
        
        # Some should succeed, some might timeout
        assert len(results) + len(errors) == 6
        assert len(results) >= pool.max_connections  # At least pool size should succeed
    
    def test_connection_leak_detection(self, pool):
        """Test detection of connection leaks"""
        leaked_connections = []
        
        # Simulate connection leak
        for i in range(pool.max_connections):
            conn = pool.get_connection()
            leaked_connections.append(conn)
            # Don't return connections - simulate leak
        
        # Pool should be exhausted
        with pytest.raises(TimeoutError):
            pool.get_connection(timeout=0.1)
        
        assert pool.active_count == pool.max_connections
        assert pool.available_count == 0
        
        # Clean up the leak
        for conn in leaked_connections:
            pool.return_connection(conn)
        
        # Pool should recover
        conn = pool.get_connection(timeout=0.1)
        assert conn is not None
        pool.return_connection(conn)
    
    def test_pool_closure_during_exhaustion(self, pool):
        """Test pool behavior when closed during exhaustion"""
        connections = []
        
        try:
            # Exhaust the pool
            for i in range(pool.max_connections):
                conn = pool.get_connection()
                connections.append(conn)
            
            # Close the pool
            pool.close_all()
            
            # New requests should fail immediately
            with pytest.raises(Exception, match="Pool is closed"):
                pool.get_connection(timeout=1.0)
        
        finally:
            # Connections should be closed by pool closure
            for conn in connections:
                assert conn.is_closed
    
    def test_stress_test_with_rapid_requests(self, large_pool):
        """Stress test with rapid connection requests and returns"""
        success_count = 0
        error_count = 0
        lock = threading.Lock()
        
        def rapid_request_worker():
            nonlocal success_count, error_count
            
            for _ in range(10):  # Each worker makes 10 requests
                try:
                    conn = large_pool.get_connection(timeout=0.5)
                    time.sleep(0.01)  # Minimal work simulation
                    large_pool.return_connection(conn)
                    
                    with lock:
                        success_count += 1
                except Exception:
                    with lock:
                        error_count += 1
        
        # Run multiple workers concurrently
        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = [executor.submit(rapid_request_worker) for _ in range(20)]
            
            for future in as_completed(futures, timeout=10.0):
                future.result()
        
        total_requests = success_count + error_count
        success_rate = success_count / total_requests if total_requests > 0 else 0
        
        # Should have high success rate with proper pool management
        assert success_rate > 0.8, f"Success rate too low: {success_rate}"
        assert large_pool.active_count == 0, "All connections should be returned"
    
    @pytest.mark.asyncio
    async def test_async_pool_exhaustion(self):
        """Test async version of pool exhaustion"""
        
        class AsyncMockPool:
            def __init__(self, max_connections=3):
                self.max_connections = max_connections
                self.semaphore = asyncio.Semaphore(max_connections)
                self.active_connections = set()
                self.connection_counter = 0
            
            async def get_connection(self, timeout=1.0):
                try:
                    await asyncio.wait_for(self.semaphore.acquire(), timeout=timeout)
                    conn = MockConnection(self.connection_counter)
                    self.connection_counter += 1
                    self.active_connections.add(conn)
                    return conn
                except asyncio.TimeoutError:
                    raise TimeoutError("Failed to get connection")
            
            async def return_connection(self, connection):
                if connection in self.active_connections:
                    self.active_connections.remove(connection)
                    self.semaphore.release()
        
        pool = AsyncMockPool(max_connections=2)
        connections = []
        
        try:
            # Exhaust the pool
            for i in range(2):
                conn = await pool.get_connection()
                connections.append(conn)
            
            # Next request should timeout
            with pytest.raises(TimeoutError):
                await pool.get_connection(timeout=0.1)
        
        finally:
            # Clean up
            for conn in connections:
                await pool.return_connection(conn)
    
    def test_connection_validation_on_return(self, pool):
        """Test that returned connections are validated"""
        conn = pool.get_connection()
        
        # Close the connection externally
        conn.close()
        
        # Return the closed connection
        pool.return_connection(conn)
        
        # Pool should not reuse closed connections
        new_conn = pool.get_connection()
        assert new_conn.connection_id != conn.connection_id
        assert not new_conn.is_closed
        
        pool.return_connection(new_conn)
    
    def test_pool_metrics_accuracy(self, pool):
        """Test that pool metrics are accurate under load"""
        connections = []
        
        # Test initial state
        assert pool.active_count == 0
        assert pool.available_count == 0
        
        # Get some connections
        for i in range(2):
            conn = pool.get_connection()
            connections.append(conn)
        
        assert pool.active_count == 2
        assert pool.available_count == 0
        
        # Return one connection
        pool.return_connection(connections.pop())
        
        assert pool.active_count == 1
        assert pool.available_count == 1
        
        # Clean up
        for conn in connections:
            pool.return_connection(conn)
        
        assert pool.active_count == 0
        assert pool.available_count == 1
    
    def test_timeout_configuration(self):
        """Test different timeout configurations"""
        # Short timeout pool
        short_pool = MockDatabasePool(max_connections=1, connection_timeout=0.1)
        
        try:
            conn1 = short_pool.get_connection()
            
            start_time = time.time()
            with pytest.raises(TimeoutError):
                short_pool.get_connection()  # Should use default short timeout
            
            elapsed = time.time() - start_time
            assert elapsed < 0.2, f"Timeout took too long: {elapsed}s"
            
            short_pool.return_connection(conn1)
        
        finally:
            short_pool.close_all()
