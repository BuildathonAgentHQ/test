import unittest
from unittest.mock import patch
import io
import sys

import qwertyqwerty


class TestQwertyqwerty(unittest.TestCase):

    def test_main_prints_correct_output(self):
        """Test that main() prints the expected string."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwertyqwerty.main()
        self.assertEqual(captured.getvalue(), "qwertyqwerty qwertyqwerty hello\n")

    def test_main_prints_exactly_once(self):
        """Test that main() prints exactly one line."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwertyqwerty.main()
        lines = captured.getvalue().splitlines()
        self.assertEqual(len(lines), 1)

    def test_output_contains_qwertyqwerty(self):
        """Test that output contains 'qwertyqwerty'."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwertyqwerty.main()
        self.assertIn("qwertyqwerty", captured.getvalue())

    def test_output_contains_hello(self):
        """Test that output contains 'hello'."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwertyqwerty.main()
        self.assertIn("hello", captured.getvalue())

    def test_output_starts_with_qwertyqwerty(self):
        """Test that output starts with 'qwertyqwerty'."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwertyqwerty.main()
        self.assertTrue(captured.getvalue().startswith("qwertyqwerty"))

    def test_output_ends_with_hello(self):
        """Test that output ends with 'hello'."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwertyqwerty.main()
        self.assertTrue(captured.getvalue().strip().endswith("hello"))

    def test_main_returns_none(self):
        """Test that main() returns None."""
        with patch("sys.stdout"):
            result = qwertyqwerty.main()
        self.assertIsNone(result)

    def test_qwertyqwerty_appears_twice(self):
        """Test that 'qwertyqwerty' appears exactly twice in the output."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwertyqwerty.main()
        output = captured.getvalue()
        self.assertEqual(output.count("qwertyqwerty"), 2)

    def test_module_has_main_function(self):
        """Test that the module exposes a main() function."""
        self.assertTrue(callable(qwertyqwerty.main))

    def test_main_callable_multiple_times(self):
        """Test that main() can be called multiple times and produces consistent output."""
        expected = "qwertyqwerty qwertyqwerty hello\n"
        for _ in range(3):
            captured = io.StringIO()
            with patch("sys.stdout", captured):
                qwertyqwerty.main()
            self.assertEqual(captured.getvalue(), expected)


if __name__ == "__main__":
    unittest.main()
