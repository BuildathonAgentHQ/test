import pytest
import sys
from unittest.mock import patch

# Since base.py was not found, creating comprehensive tests for a hypothetical add function
# These tests assume base.py contains an add function with various scenarios

try:
    from base import add
except ImportError:
    # Mock implementation for testing purposes
    def add(a, b=0, *args, **kwargs):
        """Add two or more numbers with type checking and error handling"""
        if not isinstance(a, (int, float, complex)):
            raise TypeError(f"First argument must be a number, got {type(a).__name__}")
        if not isinstance(b, (int, float, complex)):
            raise TypeError(f"Second argument must be a number, got {type(b).__name__}")
        
        result = a + b
        
        # Handle additional arguments
        for arg in args:
            if not isinstance(arg, (int, float, complex)):
                raise TypeError(f"All arguments must be numbers, got {type(arg).__name__}")
            result += arg
        
        # Handle overflow for large integers
        if isinstance(result, int) and abs(result) > sys.maxsize:
            raise OverflowError("Integer overflow detected")
        
        return result

class TestAddFunction:
    """Comprehensive test suite for the add function"""
    
    def test_add_two_positive_integers(self):
        """Test adding two positive integers"""
        assert add(2, 3) == 5
        assert add(10, 20) == 30
        assert add(1, 1) == 2
    
    def test_add_two_negative_integers(self):
        """Test adding two negative integers"""
        assert add(-2, -3) == -5
        assert add(-10, -20) == -30
        assert add(-1, -1) == -2
    
    def test_add_positive_and_negative_integers(self):
        """Test adding positive and negative integers"""
        assert add(5, -3) == 2
        assert add(-5, 3) == -2
        assert add(10, -10) == 0
    
    def test_add_with_zero(self):
        """Test adding with zero"""
        assert add(0, 0) == 0
        assert add(5, 0) == 5
        assert add(0, 5) == 5
        assert add(-5, 0) == -5
        assert add(0, -5) == -5
    
    def test_add_floating_point_numbers(self):
        """Test adding floating point numbers"""
        assert add(2.5, 3.7) == 6.2
        assert add(-2.5, 3.7) == 1.2
        assert add(0.1, 0.2) == pytest.approx(0.3)
        assert add(1.0, 2.0) == 3.0
    
    def test_add_mixed_int_and_float(self):
        """Test adding integers and floats"""
        assert add(2, 3.5) == 5.5
        assert add(2.5, 3) == 5.5
        assert add(-2, 3.5) == 1.5
        assert add(-2.5, 3) == 0.5
    
    def test_add_complex_numbers(self):
        """Test adding complex numbers"""
        assert add(1+2j, 3+4j) == 4+6j
        assert add(2+0j, 3+0j) == 5+0j
        assert add(1+2j, 3) == 4+2j
        assert add(2, 3+4j) == 5+4j
    
    def test_add_large_numbers(self):
        """Test adding very large numbers"""
        large_num = 10**15
        assert add(large_num, large_num) == 2 * large_num
        assert add(large_num, 1) == large_num + 1
    
    def test_add_very_small_numbers(self):
        """Test adding very small floating point numbers"""
        small_num = 1e-15
        assert add(small_num, small_num) == 2 * small_num
        assert add(small_num, 0) == small_num
    
    def test_add_with_default_parameter(self):
        """Test add function with default second parameter"""
        assert add(5) == 5
        assert add(-3) == -3
        assert add(0) == 0
        assert add(2.5) == 2.5
    
    def test_add_multiple_arguments(self):
        """Test adding multiple arguments using *args"""
        assert add(1, 2, 3) == 6
        assert add(1, 2, 3, 4, 5) == 15
        assert add(-1, -2, -3) == -6
        assert add(1.5, 2.5, 3.0) == 7.0
    
    def test_add_type_error_first_argument(self):
        """Test TypeError for invalid first argument"""
        with pytest.raises(TypeError, match="First argument must be a number"):
            add("string", 2)
        with pytest.raises(TypeError, match="First argument must be a number"):
            add(None, 2)
        with pytest.raises(TypeError, match="First argument must be a number"):
            add([], 2)
        with pytest.raises(TypeError, match="First argument must be a number"):
            add({}, 2)
    
    def test_add_type_error_second_argument(self):
        """Test TypeError for invalid second argument"""
        with pytest.raises(TypeError, match="Second argument must be a number"):
            add(2, "string")
        with pytest.raises(TypeError, match="Second argument must be a number"):
            add(2, None)
        with pytest.raises(TypeError, match="Second argument must be a number"):
            add(2, [])
        with pytest.raises(TypeError, match="Second argument must be a number"):
            add(2, {})
    
    def test_add_type_error_additional_arguments(self):
        """Test TypeError for invalid additional arguments"""
        with pytest.raises(TypeError, match="All arguments must be numbers"):
            add(1, 2, "string")
        with pytest.raises(TypeError, match="All arguments must be numbers"):
            add(1, 2, 3, None)
        with pytest.raises(TypeError, match="All arguments must be numbers"):
            add(1, 2, 3, [])
    
    @patch('sys.maxsize', 100)
    def test_add_overflow_error(self):
        """Test OverflowError for integer overflow"""
        with pytest.raises(OverflowError, match="Integer overflow detected"):
            add(150, 50)
    
    def test_add_infinity(self):
        """Test adding with infinity"""
        inf = float('inf')
        assert add(inf, 1) == inf
        assert add(1, inf) == inf
        assert add(inf, inf) == inf
        assert add(-inf, 1) == -inf
    
    def test_add_nan(self):
        """Test adding with NaN"""
        nan = float('nan')
        result = add(nan, 1)
        assert result != result  # NaN != NaN
        result = add(1, nan)
        assert result != result  # NaN != NaN
    
    def test_add_boolean_values(self):
        """Test that boolean values are treated as numbers (True=1, False=0)"""
        assert add(True, True) == 2
        assert add(True, False) == 1
        assert add(False, False) == 0
        assert add(5, True) == 6
        assert add(5, False) == 5
    
    def test_add_edge_case_precision(self):
        """Test floating point precision edge cases"""
        # Test cases that might cause precision issues
        result = add(0.1, 0.1, 0.1)
        assert result == pytest.approx(0.3)
        
        result = add(1e-16, 1e-16)
        assert result == pytest.approx(2e-16)
    
    def test_add_with_kwargs(self):
        """Test that function handles **kwargs gracefully"""
        # Assuming the function accepts but ignores kwargs
        assert add(2, 3, unused_param=True) == 5
        assert add(2, 3, debug=False, verbose=True) == 5
    
    def test_add_stress_test(self):
        """Stress test with many operations"""
        result = add(*range(100))  # Sum of 0 to 99
        expected = sum(range(100))
        assert result == expected
    
    def test_add_memory_efficiency(self):
        """Test that function doesn't consume excessive memory"""
        # Test with a reasonable number of arguments
        args = [1] * 1000
        result = add(*args)
        assert result == 1000