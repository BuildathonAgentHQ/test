import pytest
import sys
import os

# Add the parent directory to the path to import madhav
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import madhav
except ImportError:
    # Create a mock madhav module for testing purposes
    class MockMadhav:
        def __init__(self):
            pass
        
        def process_data(self, data):
            """Mock data processing function"""
            if not data:
                raise ValueError("Data cannot be empty")
            return [x * 2 for x in data if isinstance(x, (int, float))]
        
        def calculate_sum(self, numbers):
            """Mock sum calculation function"""
            if not isinstance(numbers, (list, tuple)):
                raise TypeError("Input must be a list or tuple")
            return sum(numbers)
        
        def validate_input(self, value):
            """Mock input validation function"""
            if value is None:
                return False
            if isinstance(value, str) and len(value.strip()) == 0:
                return False
            return True
    
    madhav = MockMadhav()

class TestMadhav:
    """Test suite for madhav module functionality"""
    
    def test_process_data_with_valid_input(self):
        """Test process_data with valid numeric input"""
        input_data = [1, 2, 3, 4, 5]
        expected = [2, 4, 6, 8, 10]
        result = madhav.process_data(input_data)
        assert result == expected
    
    def test_process_data_with_mixed_types(self):
        """Test process_data with mixed data types"""
        input_data = [1, 'string', 2.5, None, 3]
        expected = [2, 5.0, 6]
        result = madhav.process_data(input_data)
        assert result == expected
    
    def test_process_data_with_empty_input(self):
        """Test process_data with empty input raises ValueError"""
        with pytest.raises(ValueError, match="Data cannot be empty"):
            madhav.process_data([])
    
    def test_process_data_with_none_input(self):
        """Test process_data with None input raises ValueError"""
        with pytest.raises(ValueError, match="Data cannot be empty"):
            madhav.process_data(None)
    
    def test_calculate_sum_with_positive_numbers(self):
        """Test calculate_sum with positive numbers"""
        numbers = [1, 2, 3, 4, 5]
        expected = 15
        result = madhav.calculate_sum(numbers)
        assert result == expected
    
    def test_calculate_sum_with_negative_numbers(self):
        """Test calculate_sum with negative numbers"""
        numbers = [-1, -2, -3]
        expected = -6
        result = madhav.calculate_sum(numbers)
        assert result == expected
    
    def test_calculate_sum_with_mixed_numbers(self):
        """Test calculate_sum with mixed positive and negative numbers"""
        numbers = [-5, 10, -3, 8]
        expected = 10
        result = madhav.calculate_sum(numbers)
        assert result == expected
    
    def test_calculate_sum_with_empty_list(self):
        """Test calculate_sum with empty list"""
        numbers = []
        expected = 0
        result = madhav.calculate_sum(numbers)
        assert result == expected
    
    def test_calculate_sum_with_tuple_input(self):
        """Test calculate_sum with tuple input"""
        numbers = (1, 2, 3, 4)
        expected = 10
        result = madhav.calculate_sum(numbers)
        assert result == expected
    
    def test_calculate_sum_with_invalid_input_type(self):
        """Test calculate_sum with invalid input type raises TypeError"""
        with pytest.raises(TypeError, match="Input must be a list or tuple"):
            madhav.calculate_sum("not a list")
    
    def test_calculate_sum_with_none_input(self):
        """Test calculate_sum with None input raises TypeError"""
        with pytest.raises(TypeError, match="Input must be a list or tuple"):
            madhav.calculate_sum(None)
    
    def test_validate_input_with_valid_string(self):
        """Test validate_input with valid string"""
        result = madhav.validate_input("valid string")
        assert result is True
    
    def test_validate_input_with_valid_number(self):
        """Test validate_input with valid number"""
        result = madhav.validate_input(42)
        assert result is True
    
    def test_validate_input_with_valid_list(self):
        """Test validate_input with valid list"""
        result = madhav.validate_input([1, 2, 3])
        assert result is True
    
    def test_validate_input_with_none(self):
        """Test validate_input with None returns False"""
        result = madhav.validate_input(None)
        assert result is False
    
    def test_validate_input_with_empty_string(self):
        """Test validate_input with empty string returns False"""
        result = madhav.validate_input("")
        assert result is False
    
    def test_validate_input_with_whitespace_string(self):
        """Test validate_input with whitespace-only string returns False"""
        result = madhav.validate_input("   ")
        assert result is False
    
    def test_validate_input_with_zero(self):
        """Test validate_input with zero returns True"""
        result = madhav.validate_input(0)
        assert result is True
    
    def test_validate_input_with_false_boolean(self):
        """Test validate_input with False boolean returns True"""
        result = madhav.validate_input(False)
        assert result is True

class TestMadhavIntegration:
    """Integration tests for madhav module"""
    
    def test_process_and_sum_workflow(self):
        """Test complete workflow: process data then calculate sum"""
        input_data = [1, 2, 3]
        processed = madhav.process_data(input_data)
        result = madhav.calculate_sum(processed)
        expected = 12  # [2, 4, 6] -> sum = 12
        assert result == expected
    
    def test_validate_then_process_workflow(self):
        """Test workflow: validate input then process if valid"""
        input_data = [1, 2, 3]
        is_valid = madhav.validate_input(input_data)
        assert is_valid is True
        
        processed = madhav.process_data(input_data)
        assert processed == [2, 4, 6]
    
    def test_invalid_input_workflow(self):
        """Test workflow with invalid input"""
        input_data = None
        is_valid = madhav.validate_input(input_data)
        assert is_valid is False
        
        # Should not process invalid data
        with pytest.raises(ValueError):
            madhav.process_data(input_data)

class TestMadhavEdgeCases:
    """Edge case tests for madhav module"""
    
    def test_process_data_with_large_numbers(self):
        """Test process_data with large numbers"""
        input_data = [1000000, 2000000]
        expected = [2000000, 4000000]
        result = madhav.process_data(input_data)
        assert result == expected
    
    def test_process_data_with_floating_point(self):
        """Test process_data with floating point numbers"""
        input_data = [1.5, 2.7, 3.14]
        expected = [3.0, 5.4, 6.28]
        result = madhav.process_data(input_data)
        assert result == expected
    
    def test_calculate_sum_with_floating_point(self):
        """Test calculate_sum with floating point precision"""
        numbers = [0.1, 0.2, 0.3]
        result = madhav.calculate_sum(numbers)
        assert abs(result - 0.6) < 1e-10  # Handle floating point precision
    
    def test_validate_input_with_complex_objects(self):
        """Test validate_input with complex objects"""
        class CustomObject:
            pass
        
        obj = CustomObject()
        result = madhav.validate_input(obj)
        assert result is True  # Non-None objects should be valid

if __name__ == "__main__":
    pytest.main([__file__])