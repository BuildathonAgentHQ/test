import pytest
import sys
from io import StringIO
from ayush import hello_ayush


class TestHelloAyush:
    """Test cases for the hello_ayush function."""
    
    def test_hello_ayush_prints_correct_message(self, capsys):
        """Test that hello_ayush prints 'Hello Ayush' to stdout."""
        hello_ayush()
        captured = capsys.readouterr()
        assert captured.out.strip() == "Hello Ayush"
    
    def test_hello_ayush_no_stderr_output(self, capsys):
        """Test that hello_ayush doesn't print to stderr."""
        hello_ayush()
        captured = capsys.readouterr()
        assert captured.err == ""
    
    def test_hello_ayush_returns_none(self):
        """Test that hello_ayush returns None (standard for print functions)."""
        result = hello_ayush()
        assert result is None
    
    def test_hello_ayush_callable(self):
        """Test that hello_ayush is callable."""
        assert callable(hello_ayush)
    
    def test_hello_ayush_function_exists(self):
        """Test that hello_ayush function exists in the module."""
        import ayush
        assert hasattr(ayush, 'hello_ayush')
    
    def test_hello_ayush_docstring_exists(self):
        """Test that hello_ayush has a docstring."""
        assert hello_ayush.__doc__ is not None
        assert len(hello_ayush.__doc__.strip()) > 0
    
    def test_hello_ayush_multiple_calls(self, capsys):
        """Test that multiple calls to hello_ayush work correctly."""
        hello_ayush()
        hello_ayush()
        captured = capsys.readouterr()
        lines = captured.out.strip().split('\n')
        assert len(lines) == 2
        assert all(line == "Hello Ayush" for line in lines)
    
    def test_module_has_proper_structure(self):
        """Test that the ayush module follows Python conventions."""
        import ayush
        # Check if module has __name__ attribute
        assert hasattr(ayush, '__name__')
        # Check if function name follows snake_case convention
        assert 'hello_ayush' in dir(ayush)
    
    def test_hello_ayush_no_parameters_required(self):
        """Test that hello_ayush can be called without parameters."""
        try:
            hello_ayush()
        except TypeError:
            pytest.fail("hello_ayush() should not require any parameters")
    
    def test_hello_ayush_exact_output_format(self, capsys):
        """Test the exact format of the output including newline."""
        hello_ayush()
        captured = capsys.readouterr()
        assert captured.out == "Hello Ayush\n"