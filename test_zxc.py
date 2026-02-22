import unittest
from io import StringIO
from unittest.mock import patch
import zxc


class TestZxcMain(unittest.TestCase):
    def test_output_is_correct(self):
        """Test that main() prints exactly 'zxc zxc hello'."""
        with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
            zxc.main()
            self.assertEqual(mock_stdout.getvalue(), "zxc zxc hello\n")

    def test_output_contains_zxc(self):
        """Test that output contains 'zxc'."""
        with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
            zxc.main()
            self.assertIn("zxc", mock_stdout.getvalue())

    def test_output_contains_hello(self):
        """Test that output contains 'hello'."""
        with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
            zxc.main()
            self.assertIn("hello", mock_stdout.getvalue())

    def test_output_ends_with_newline(self):
        """Test that output ends with a newline character."""
        with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
            zxc.main()
            self.assertTrue(mock_stdout.getvalue().endswith("\n"))

    def test_output_single_line(self):
        """Test that main() produces exactly one line of output."""
        with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
            zxc.main()
            lines = mock_stdout.getvalue().strip().splitlines()
            self.assertEqual(len(lines), 1)

    def test_output_not_empty(self):
        """Test that main() does not produce empty output."""
        with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
            zxc.main()
            self.assertNotEqual(mock_stdout.getvalue().strip(), "")

    def test_output_exact_word_count(self):
        """Test that output has exactly 3 words."""
        with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
            zxc.main()
            words = mock_stdout.getvalue().strip().split()
            self.assertEqual(len(words), 3)

    def test_main_returns_none(self):
        """Test that main() returns None."""
        with patch("sys.stdout", new_callable=StringIO):
            result = zxc.main()
            self.assertIsNone(result)


class TestZxcModule(unittest.TestCase):
    def test_main_function_exists(self):
        """Test that the main function is defined in the module."""
        self.assertTrue(hasattr(zxc, "main"))
        self.assertTrue(callable(zxc.main))

    def test_main_called_when_run_as_script(self):
        """Test that __name__ == '__main__' block calls main."""
        with patch("zxc.main") as mock_main:
            import importlib
            import sys

            # Reload with __name__ set to '__main__'
            original_name = zxc.__name__
            zxc.__name__ = "__main__"
            try:
                exec(
                    compile(open("zxc.py").read(), "zxc.py", "exec"),
                    {"__name__": "__main__"},
                )
            finally:
                zxc.__name__ = original_name


if __name__ == "__main__":
    unittest.main()
