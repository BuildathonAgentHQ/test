import pytest
from madhav import hello_madhav, greet_madhav, MadhavGreeter


class TestHelloMadhav:
    """Test cases for hello_madhav function."""
    
    def test_hello_madhav_returns_correct_greeting(self):
        """Test that hello_madhav returns the correct greeting message."""
        result = hello_madhav()
        assert result == "Hello Madhav!"
        assert isinstance(result, str)
    
    def test_hello_madhav_no_parameters(self):
        """Test that hello_madhav works without any parameters."""
        result = hello_madhav()
        assert "Madhav" in result
        assert result.startswith("Hello")


class TestGreetMadhav:
    """Test cases for greet_madhav function with custom messages."""
    
    def test_greet_madhav_default_message(self):
        """Test greet_madhav with default greeting."""
        result = greet_madhav()
        assert result == "Hello Madhav!"
    
    def test_greet_madhav_custom_greeting(self):
        """Test greet_madhav with custom greeting."""
        result = greet_madhav("Good morning")
        assert result == "Good morning Madhav!"
    
    def test_greet_madhav_empty_greeting(self):
        """Test greet_madhav with empty greeting."""
        result = greet_madhav("")
        assert result == " Madhav!"
    
    def test_greet_madhav_with_punctuation(self):
        """Test greet_madhav handles greetings with punctuation."""
        result = greet_madhav("Hey there,")
        assert result == "Hey there, Madhav!"
    
    def test_greet_madhav_case_sensitivity(self):
        """Test greet_madhav preserves case in custom greetings."""
        result = greet_madhav("HELLO")
        assert result == "HELLO Madhav!"
        
        result = greet_madhav("hello")
        assert result == "hello Madhav!"


class TestMadhavGreeter:
    """Test cases for MadhavGreeter class."""
    
    def test_madhav_greeter_initialization(self):
        """Test MadhavGreeter can be initialized."""
        greeter = MadhavGreeter()
        assert isinstance(greeter, MadhavGreeter)
    
    def test_madhav_greeter_greet_method(self):
        """Test MadhavGreeter greet method."""
        greeter = MadhavGreeter()
        result = greeter.greet()
        assert result == "Hello Madhav!"
    
    def test_madhav_greeter_greet_with_custom_message(self):
        """Test MadhavGreeter greet method with custom message."""
        greeter = MadhavGreeter()
        result = greeter.greet("Welcome")
        assert result == "Welcome Madhav!"
    
    def test_madhav_greeter_get_name_method(self):
        """Test MadhavGreeter get_name method."""
        greeter = MadhavGreeter()
        result = greeter.get_name()
        assert result == "Madhav"
    
    def test_madhav_greeter_multiple_greetings(self):
        """Test MadhavGreeter can handle multiple greetings."""
        greeter = MadhavGreeter()
        greetings = ["Hello", "Hi", "Good day", "Greetings"]
        
        for greeting in greetings:
            result = greeter.greet(greeting)
            assert result == f"{greeting} Madhav!"
            assert "Madhav" in result


class TestMadhavModule:
    """Test cases for module-level functionality."""
    
    def test_module_constants(self):
        """Test that module has expected constants."""
        from madhav import NAME
        assert NAME == "Madhav"
    
    def test_module_imports(self):
        """Test that all expected functions and classes can be imported."""
        try:
            from madhav import hello_madhav, greet_madhav, MadhavGreeter, NAME
            assert True
        except ImportError as e:
            pytest.fail(f"Failed to import expected items: {e}")
    
    def test_module_docstring_exists(self):
        """Test that the module has a docstring."""
        import madhav
        assert madhav.__doc__ is not None
        assert len(madhav.__doc__.strip()) > 0


class TestEdgeCases:
    """Test edge cases and error handling."""
    
    def test_greet_madhav_with_none(self):
        """Test greet_madhav handles None input gracefully."""
        with pytest.raises(TypeError):
            greet_madhav(None)
    
    def test_greet_madhav_with_numeric_input(self):
        """Test greet_madhav handles numeric input."""
        with pytest.raises(TypeError):
            greet_madhav(123)
    
    def test_madhav_greeter_greet_with_none(self):
        """Test MadhavGreeter greet method handles None input."""
        greeter = MadhavGreeter()
        with pytest.raises(TypeError):
            greeter.greet(None)


class TestStringFormatting:
    """Test string formatting and output quality."""
    
    def test_greeting_ends_with_exclamation(self):
        """Test that all greetings end with exclamation mark."""
        assert hello_madhav().endswith("!")
        assert greet_madhav().endswith("!")
        assert greet_madhav("Hi").endswith("!")
        
        greeter = MadhavGreeter()
        assert greeter.greet().endswith("!")
        assert greeter.greet("Hey").endswith("!")
    
    def test_greeting_contains_madhav(self):
        """Test that all greetings contain 'Madhav'."""
        assert "Madhav" in hello_madhav()
        assert "Madhav" in greet_madhav()
        assert "Madhav" in greet_madhav("Howdy")
        
        greeter = MadhavGreeter()
        assert "Madhav" in greeter.greet()
        assert "Madhav" in greeter.greet("Salutations")
    
    def test_greeting_proper_spacing(self):
        """Test that greetings have proper spacing."""
        result = greet_madhav("Hello")
        assert result == "Hello Madhav!"
        assert "  " not in result  # No double spaces
        
        greeter = MadhavGreeter()
        result = greeter.greet("Hi")
        assert result == "Hi Madhav!"
        assert "  " not in result  # No double spaces