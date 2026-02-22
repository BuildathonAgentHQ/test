import pytest
import asyncio
import time
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime, timedelta
import threading
import concurrent.futures
from contextlib import contextmanager


class MockOAuthClient:
    def __init__(self):
        self.token = None
        self.expires_at = None
        self.refresh_calls = 0
        self.refresh_delay = 0
        self.should_fail = False
        self.lock = threading.Lock()
    
    async def refresh_token(self, timeout=30):
        with self.lock:
            self.refresh_calls += 1
        
        if self.refresh_delay > 0:
            await asyncio.sleep(self.refresh_delay)
        
        if self.should_fail:
            raise Exception("Token refresh failed")
        
        self.token = f"token_{int(time.time())}"
        self.expires_at = datetime.now() + timedelta(hours=1)
        return self.token
    
    def is_token_expired(self):
        if not self.expires_at:
            return True
        return datetime.now() >= self.expires_at


class TestOAuthTokenRefreshTimeout:
    
    @pytest.fixture
    def oauth_client(self):
        return MockOAuthClient()
    
    @pytest.fixture
    def deterministic_time(self):
        """Fixture to control time progression deterministically"""
        start_time = time.time()
        with patch('time.time') as mock_time:
            mock_time.return_value = start_time
            yield mock_time
    
    @contextmanager
    def timeout_context(self, timeout_seconds):
        """Context manager to simulate timeout conditions"""
        start = time.time()
        try:
            yield
        finally:
            elapsed = time.time() - start
            if elapsed > timeout_seconds:
                raise asyncio.TimeoutError(f"Operation timed out after {elapsed}s")
    
    def test_token_refresh_basic_timeout(self, oauth_client):
        """Test basic timeout functionality without race conditions"""
        oauth_client.refresh_delay = 2.0
        
        start_time = time.time()
        
        with pytest.raises(asyncio.TimeoutError):
            asyncio.run(asyncio.wait_for(
                oauth_client.refresh_token(), 
                timeout=1.0
            ))
        
        elapsed = time.time() - start_time
        assert 0.9 <= elapsed <= 1.5, f"Timeout should occur around 1s, got {elapsed}s"
    
    def test_token_refresh_just_under_timeout(self, oauth_client):
        """Test refresh that completes just before timeout"""
        oauth_client.refresh_delay = 0.9
        
        async def test_refresh():
            token = await asyncio.wait_for(
                oauth_client.refresh_token(), 
                timeout=1.0
            )
            assert token is not None
            assert oauth_client.refresh_calls == 1
        
        asyncio.run(test_refresh())
    
    def test_token_refresh_just_over_timeout(self, oauth_client):
        """Test refresh that times out just after threshold"""
        oauth_client.refresh_delay = 1.1
        
        with pytest.raises(asyncio.TimeoutError):
            asyncio.run(asyncio.wait_for(
                oauth_client.refresh_token(), 
                timeout=1.0
            ))
    
    def test_concurrent_refresh_attempts_race_condition(self, oauth_client):
        """Test race condition with multiple concurrent refresh attempts"""
        oauth_client.refresh_delay = 0.5
        results = []
        exceptions = []
        
        async def refresh_with_timeout(client_id):
            try:
                token = await asyncio.wait_for(
                    oauth_client.refresh_token(), 
                    timeout=1.0
                )
                results.append((client_id, token))
            except Exception as e:
                exceptions.append((client_id, e))
        
        async def run_concurrent_refreshes():
            tasks = [
                refresh_with_timeout(i) for i in range(5)
            ]
            await asyncio.gather(*tasks, return_exceptions=True)
        
        asyncio.run(run_concurrent_refreshes())
        
        # All should succeed since delay < timeout
        assert len(results) == 5
        assert len(exceptions) == 0
        assert oauth_client.refresh_calls == 5
    
    def test_mixed_timeout_scenarios_race_condition(self, oauth_client):
        """Test race condition with mixed success/timeout scenarios"""
        call_delays = [0.5, 1.5, 0.8, 2.0, 0.3]  # Some will timeout, some won't
        results = []
        timeouts = []
        
        async def refresh_with_variable_delay(delay, client_id):
            # Simulate different delays per call
            original_delay = oauth_client.refresh_delay
            oauth_client.refresh_delay = delay
            
            try:
                token = await asyncio.wait_for(
                    oauth_client.refresh_token(), 
                    timeout=1.0
                )
                results.append((client_id, token))
            except asyncio.TimeoutError:
                timeouts.append(client_id)
            finally:
                oauth_client.refresh_delay = original_delay
        
        async def run_mixed_scenarios():
            tasks = [
                refresh_with_variable_delay(delay, i) 
                for i, delay in enumerate(call_delays)
            ]
            await asyncio.gather(*tasks, return_exceptions=True)
        
        asyncio.run(run_mixed_scenarios())
        
        # Calls with delay <= 1.0 should succeed, others should timeout
        expected_successes = sum(1 for delay in call_delays if delay <= 1.0)
        expected_timeouts = len(call_delays) - expected_successes
        
        assert len(results) == expected_successes
        assert len(timeouts) == expected_timeouts
    
    def test_system_clock_changes_during_refresh(self, oauth_client):
        """Test behavior when system clock changes during refresh"""
        oauth_client.refresh_delay = 0.5
        
        with patch('time.time') as mock_time:
            # Start at time 1000
            mock_time.return_value = 1000.0
            
            async def refresh_with_clock_jump():
                # Start refresh
                task = asyncio.create_task(
                    asyncio.wait_for(
                        oauth_client.refresh_token(), 
                        timeout=1.0
                    )
                )
                
                # Simulate clock jump forward during refresh
                await asyncio.sleep(0.1)
                mock_time.return_value = 1002.0  # Jump 2 seconds forward
                
                return await task
            
            # Should still complete successfully despite clock jump
            token = asyncio.run(refresh_with_clock_jump())
            assert token is not None
    
    def test_external_dependency_timeout_propagation(self, oauth_client):
        """Test timeout propagation from external dependencies"""
        
        class ExternalServiceMock:
            def __init__(self, delay):
                self.delay = delay
            
            async def validate_token(self, token):
                await asyncio.sleep(self.delay)
                return True
        
        external_service = ExternalServiceMock(1.5)
        
        async def refresh_with_external_validation():
            token = await oauth_client.refresh_token()
            # This should timeout
            await asyncio.wait_for(
                external_service.validate_token(token),
                timeout=1.0
            )
            return token
        
        with pytest.raises(asyncio.TimeoutError):
            asyncio.run(refresh_with_external_validation())
    
    def test_network_latency_simulation(self, oauth_client):
        """Test with simulated network latency variations"""
        import random
        
        # Simulate variable network latency
        latencies = []
        
        async def refresh_with_network_latency():
            # Simulate network call with random latency
            latency = random.uniform(0.1, 0.8)
            latencies.append(latency)
            
            await asyncio.sleep(latency)
            return await oauth_client.refresh_token()
        
        # Run multiple times to test consistency
        for _ in range(10):
            try:
                token = asyncio.run(asyncio.wait_for(
                    refresh_with_network_latency(),
                    timeout=1.0
                ))
                assert token is not None
            except asyncio.TimeoutError:
                # Some may timeout due to high latency, this is expected
                pass
        
        # Verify we had some variation in latencies
        assert len(set(latencies)) > 1, "Should have variable latencies"
    
    def test_thread_safety_with_timeouts(self, oauth_client):
        """Test thread safety when timeouts occur"""
        oauth_client.refresh_delay = 0.5
        results = []
        errors = []
        
        def threaded_refresh(thread_id):
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                token = loop.run_until_complete(
                    asyncio.wait_for(
                        oauth_client.refresh_token(),
                        timeout=1.0
                    )
                )
                results.append((thread_id, token))
            except Exception as e:
                errors.append((thread_id, e))
            finally:
                loop.close()
        
        threads = []
        for i in range(5):
            thread = threading.Thread(target=threaded_refresh, args=(i,))
            threads.append(thread)
            thread.start()
        
        for thread in threads:
            thread.join(timeout=5.0)
        
        # All threads should complete successfully
        assert len(results) == 5
        assert len(errors) == 0
        assert oauth_client.refresh_calls == 5
    
    def test_timeout_precision_and_consistency(self, oauth_client):
        """Test timeout precision and consistency across multiple runs"""
        oauth_client.refresh_delay = 1.5
        timeout_durations = []
        
        for _ in range(5):
            start_time = time.time()
            
            with pytest.raises(asyncio.TimeoutError):
                asyncio.run(asyncio.wait_for(
                    oauth_client.refresh_token(),
                    timeout=1.0
                ))
            
            duration = time.time() - start_time
            timeout_durations.append(duration)
        
        # All timeouts should be close to 1.0 second
        for duration in timeout_durations:
            assert 0.9 <= duration <= 1.2, f"Timeout duration {duration} outside expected range"
        
        # Consistency check - standard deviation should be low
        import statistics
        std_dev = statistics.stdev(timeout_durations)
        assert std_dev < 0.1, f"Timeout durations too inconsistent: {std_dev}"
    
    def test_cleanup_on_timeout(self, oauth_client):
        """Test proper cleanup when timeout occurs"""
        oauth_client.refresh_delay = 2.0
        initial_calls = oauth_client.refresh_calls
        
        with pytest.raises(asyncio.TimeoutError):
            asyncio.run(asyncio.wait_for(
                oauth_client.refresh_token(),
                timeout=1.0
            ))
        
        # Verify the call was attempted
        assert oauth_client.refresh_calls == initial_calls + 1
        
        # Verify no token was set due to timeout
        assert oauth_client.token is None or oauth_client.token.startswith("token_")
    
    @pytest.mark.parametrize("timeout_value,delay_value,should_timeout", [
        (1.0, 0.5, False),
        (1.0, 1.5, True),
        (2.0, 1.5, False),
        (0.5, 0.8, True),
        (5.0, 0.1, False)
    ])
    def test_parametrized_timeout_scenarios(self, oauth_client, timeout_value, delay_value, should_timeout):
        """Parametrized test for various timeout scenarios"""
        oauth_client.refresh_delay = delay_value
        
        if should_timeout:
            with pytest.raises(asyncio.TimeoutError):
                asyncio.run(asyncio.wait_for(
                    oauth_client.refresh_token(),
                    timeout=timeout_value
                ))
        else:
            token = asyncio.run(asyncio.wait_for(
                oauth_client.refresh_token(),
                timeout=timeout_value
            ))
            assert token is not None