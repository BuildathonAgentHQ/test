import pytest
from base import add


class TestAddFunction:
    """Test suite for the add function in base.py"""
    
    def test_add_positive_integers(self):
        """Test adding two positive integers"""
        assert add(2, 3) == 5
        assert add(10, 20) == 30
        assert add(1, 1) == 2
    
    def test_add_negative_integers(self):
        """Test adding negative integers"""
        assert add(-2, -3) == -5
        assert add(-10, -20) == -30
        assert add(-1, -1) == -2
    
    def test_add_mixed_sign_integers(self):
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
    
    def test_add_floats(self):
        """Test adding floating point numbers"""
        assert add(2.5, 3.7) == pytest.approx(6.2)
        assert add(-2.5, -3.7) == pytest.approx(-6.2)
        assert add(2.5, -1.5) == pytest.approx(1.0)
        assert add(0.1, 0.2) == pytest.approx(0.3)
    
    def test_add_large_numbers(self):
        """Test adding very large numbers"""
        assert add(999999999, 1) == 1000000000
        assert add(1e10, 1e10) == 2e10
    
    def test_add_small_numbers(self):
        """Test adding very small numbers"""
        assert add(1e-10, 1e-10) == pytest.approx(2e-10)
        assert add(-1e-10, 1e-10) == pytest.approx(0)
    
    def test_add_type_errors(self):
        """Test that add raises TypeError for invalid types"""
        with pytest.raises(TypeError):
            add("string", 5)
        with pytest.raises(TypeError):
            add(5, "string")
        with pytest.raises(TypeError):
            add(None, 5)
        with pytest.raises(TypeError):
            add(5, None)
        with pytest.raises(TypeError):
            add([], 5)
        with pytest.raises(TypeError):
            add({}, 5)
    
    def test_add_missing_arguments(self):
        """Test that add raises TypeError when arguments are missing"""
        with pytest.raises(TypeError):
            add()
        with pytest.raises(TypeError):
            add(5)
    
    def test_add_too_many_arguments(self):
        """Test that add raises TypeError when too many arguments are provided"""
        with pytest.raises(TypeError):
            add(1, 2, 3)
        with pytest.raises(TypeError):
            add(1, 2, 3, 4)
    
    def test_add_infinity(self):
        """Test adding with infinity values"""
        import math
        assert add(float('inf'), 5) == float('inf')
        assert add(5, float('inf')) == float('inf')
        assert add(float('-inf'), 5) == float('-inf')
        assert math.isnan(add(float('inf'), float('-inf')))
    
    def test_add_nan(self):
        """Test adding with NaN values"""
        import math
        assert math.isnan(add(float('nan'), 5))
        assert math.isnan(add(5, float('nan')))
        assert math.isnan(add(float('nan'), float('nan')))
    
    def test_add_boolean_values(self):
        """Test adding boolean values (if supported)"""
        # Booleans are treated as integers in Python (True=1, False=0)
        assert add(True, True) == 2
        assert add(True, False) == 1
        assert add(False, False) == 0
        assert add(True, 5) == 6
        assert add(False, 5) == 5
    
    def test_add_complex_numbers(self):
        """Test adding complex numbers (if supported)"""
        try:
            result = add(1+2j, 3+4j)
            assert result == 4+6j
        except TypeError:
            # If complex numbers are not supported, that's also valid
            pass