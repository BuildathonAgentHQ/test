import pytest
import asyncio
import time
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime, timedelta
import aiohttp
from aiohttp import ClientTimeout, ClientError


class MockOAuthClient:
    """Mock OAuth client for testing token refresh scenarios"""
    
    def __init__(self, timeout=30):
        self.timeout = timeout
        self.access_token = None
        self.refresh_token = "mock_refresh_token"
        self.token_expires_at = None
        self.refresh_in_progress = False
        self.refresh_attempts = 0
        self.max_retries = 3
    
    async def refresh_access_token(self):
        """Mock token refresh with configurable timeout behavior"""
        if self.refresh_in_progress:
            raise Exception("Token refresh already in progress")
        
        self.refresh_in_progress = True
        self.refresh_attempts += 1
        
        try:
            # Simulate network call with timeout
            timeout = ClientTimeout(total=self.timeout)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                # This would be the actual OAuth endpoint call
                await asyncio.sleep(0.1)  # Simulate network delay
                
            # Simulate successful token refresh
            self.access_token = f"new_token_{int(time.time())}"
            self.token_expires_at = datetime.now() + timedelta(hours=1)
            return self.access_token
        finally:
            self.refresh_in_progress = False
    
    def is_token_expired(self):
        """Check if current token is expired"""
        if not self.token_expires_at:
            return True
        return datetime.now() >= self.token_expires_at
    
    async def get_valid_token(self):
        """Get a valid token, refreshing if necessary"""
        if self.is_token_expired():
            return await self.refresh_access_token()
        return self.access_token


class TestOAuthTokenRefreshTimeout:
    """Test suite for OAuth token refresh timeout scenarios"""
    
    @pytest.fixture
    def oauth_client(self):
        """Create a fresh OAuth client for each test"""
        return MockOAuthClient()
    
    @pytest.fixture
    def expired_oauth_client(self):
        """Create an OAuth client with expired token"""
        client = MockOAuthClient()
        client.access_token = "expired_token"
        client.token_expires_at = datetime.now() - timedelta(minutes=1)
        return client
    
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        """Setup and teardown for each test"""
        # Setup
        self.start_time = time.time()
        
        yield
        
        # Teardown
        self.end_time = time.time()
        # Ensure no test runs longer than expected
        assert self.end_time - self.start_time < 60, "Test took too long to complete"
    
    @pytest.mark.asyncio
    async def test_successful_token_refresh_within_timeout(self, oauth_client):
        """Test successful token refresh within timeout period"""
        # Arrange
        oauth_client.timeout = 10
        initial_token = oauth_client.access_token
        
        # Act
        start_time = time.time()
        new_token = await oauth_client.refresh_access_token()
        end_time = time.time()
        
        # Assert
        assert new_token is not None
        assert new_token != initial_token
        assert oauth_client.access_token == new_token
        assert oauth_client.token_expires_at > datetime.now()
        assert end_time - start_time < oauth_client.timeout
        assert oauth_client.refresh_attempts == 1
        assert not oauth_client.refresh_in_progress
    
    @pytest.mark.asyncio
    async def test_token_refresh_timeout_exception(self, oauth_client):
        """Test token refresh raises timeout exception"""
        # Arrange
        oauth_client.timeout = 0.001  # Very short timeout
        
        with patch('aiohttp.ClientSession') as mock_session:
            mock_session.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=asyncio.TimeoutError("Request timed out")
            )
            
            # Act & Assert
            start_time = time.time()
            with pytest.raises(asyncio.TimeoutError):
                await oauth_client.refresh_access_token()
            
            end_time = time.time()
            
            # Additional assertions
            assert end_time - start_time < 1  # Should fail quickly
            assert oauth_client.refresh_attempts == 1
            assert not oauth_client.refresh_in_progress  # Should be reset even on failure
    
    @pytest.mark.asyncio
    async def test_concurrent_refresh_attempts_blocked(self, oauth_client):
        """Test that concurrent refresh attempts are blocked"""
        # Arrange
        oauth_client.refresh_in_progress = True
        
        # Act & Assert
        with pytest.raises(Exception, match="Token refresh already in progress"):
            await oauth_client.refresh_access_token()
        
        assert oauth_client.refresh_attempts == 1  # Should increment even on blocked attempt
    
    @pytest.mark.asyncio
    async def test_token_refresh_with_network_error(self, oauth_client):
        """Test token refresh handles network errors properly"""
        with patch('aiohttp.ClientSession') as mock_session:
            mock_session.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=aiohttp.ClientError("Network error")
            )
            
            # Act & Assert
            with pytest.raises(aiohttp.ClientError):
                await oauth_client.refresh_access_token()
            
            assert oauth_client.refresh_attempts == 1
            assert not oauth_client.refresh_in_progress
    
    @pytest.mark.asyncio
    async def test_get_valid_token_refreshes_expired_token(self, expired_oauth_client):
        """Test that get_valid_token refreshes expired tokens"""
        # Arrange
        old_token = expired_oauth_client.access_token
        assert expired_oauth_client.is_token_expired()
        
        # Act
        valid_token = await expired_oauth_client.get_valid_token()
        
        # Assert
        assert valid_token != old_token
        assert not expired_oauth_client.is_token_expired()
        assert expired_oauth_client.access_token == valid_token
    
    @pytest.mark.asyncio
    async def test_get_valid_token_returns_existing_valid_token(self, oauth_client):
        """Test that get_valid_token returns existing valid token without refresh"""
        # Arrange
        oauth_client.access_token = "valid_token"
        oauth_client.token_expires_at = datetime.now() + timedelta(hours=1)
        initial_attempts = oauth_client.refresh_attempts
        
        # Act
        valid_token = await oauth_client.get_valid_token()
        
        # Assert
        assert valid_token == "valid_token"
        assert oauth_client.refresh_attempts == initial_attempts  # No refresh attempted
    
    @pytest.mark.asyncio
    async def test_multiple_timeout_scenarios(self, oauth_client):
        """Test various timeout configurations"""
        timeout_scenarios = [0.1, 1, 5, 30]
        
        for timeout_val in timeout_scenarios:
            oauth_client.timeout = timeout_val
            oauth_client.refresh_attempts = 0
            
            start_time = time.time()
            try:
                await oauth_client.refresh_access_token()
                end_time = time.time()
                
                # Should complete within timeout
                assert end_time - start_time < timeout_val + 1  # Allow 1s buffer
                assert oauth_client.access_token is not None
            except asyncio.TimeoutError:
                end_time = time.time()
                # Should timeout close to the configured timeout
                assert end_time - start_time <= timeout_val + 0.5  # Small buffer for timing
    
    @pytest.mark.asyncio
    async def test_token_expiry_edge_cases(self, oauth_client):
        """Test edge cases around token expiry timing"""
        # Test token expiring right now
        oauth_client.token_expires_at = datetime.now()
        assert oauth_client.is_token_expired()
        
        # Test token expiring in 1 second
        oauth_client.token_expires_at = datetime.now() + timedelta(seconds=1)
        assert not oauth_client.is_token_expired()
        
        # Wait and check again
        await asyncio.sleep(1.1)
        assert oauth_client.is_token_expired()
    
    @pytest.mark.asyncio
    async def test_refresh_state_consistency(self, oauth_client):
        """Test that refresh state is consistent across operations"""
        # Initial state
        assert not oauth_client.refresh_in_progress
        assert oauth_client.refresh_attempts == 0
        
        # Start refresh
        refresh_task = asyncio.create_task(oauth_client.refresh_access_token())
        
        # Brief delay to let refresh start
        await asyncio.sleep(0.01)
        
        # Check state during refresh
        assert oauth_client.refresh_in_progress
        
        # Complete refresh
        await refresh_task
        
        # Check final state
        assert not oauth_client.refresh_in_progress
        assert oauth_client.refresh_attempts == 1
    
    @pytest.mark.asyncio
    async def test_timeout_with_slow_response(self, oauth_client):
        """Test timeout behavior with artificially slow responses"""
        oauth_client.timeout = 1
        
        with patch('asyncio.sleep', new_callable=AsyncMock) as mock_sleep:
            # Simulate slow network response
            mock_sleep.side_effect = lambda x: asyncio.sleep(2 if x == 0.1 else x)
            
            start_time = time.time()
            with pytest.raises((asyncio.TimeoutError, Exception)):
                await oauth_client.refresh_access_token()
            
            end_time = time.time()
            
            # Should timeout within reasonable time
            assert end_time - start_time < 3
            assert not oauth_client.refresh_in_progress
    
    def test_token_expiry_calculation(self, oauth_client):
        """Test token expiry calculation accuracy"""
        # Test with various expiry times
        test_cases = [
            (datetime.now() - timedelta(minutes=1), True),   # Expired
            (datetime.now() + timedelta(minutes=1), False),  # Valid
            (datetime.now(), True),                          # Exactly now (expired)
            (datetime.now() + timedelta(seconds=1), False), # Valid for 1 more second
        ]
        
        for expiry_time, should_be_expired in test_cases:
            oauth_client.token_expires_at = expiry_time
            assert oauth_client.is_token_expired() == should_be_expired
    
    @pytest.mark.asyncio
    async def test_cleanup_on_exception(self, oauth_client):
        """Test that cleanup happens properly when exceptions occur"""
        with patch('aiohttp.ClientSession') as mock_session:
            mock_session.return_value.__aenter__.side_effect = Exception("Setup failed")
            
            # Act & Assert
            with pytest.raises(Exception, match="Setup failed"):
                await oauth_client.refresh_access_token()
            
            # Verify cleanup
            assert not oauth_client.refresh_in_progress
            assert oauth_client.refresh_attempts == 1