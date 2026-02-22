import io
import sys
import unittest
from unittest.mock import patch

from asd import main


class TestAsd(unittest.TestCase):
    def test_main_prints_correct_output(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            main()
        self.assertEqual(captured.getvalue(), "asd asd hello\n")

    def test_main_prints_to_stdout(self):
        with patch("builtins.print") as mock_print:
            main()
            mock_print.assert_called_once_with("asd asd hello")

    def test_main_prints_exactly_once(self):
        with patch("builtins.print") as mock_print:
            main()
            self.assertEqual(mock_print.call_count, 1)

    def test_output_contains_asd(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            main()
        self.assertIn("asd", captured.getvalue())

    def test_output_contains_hello(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            main()
        self.assertIn("hello", captured.getvalue())

    def test_output_ends_with_newline(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            main()
        self.assertTrue(captured.getvalue().endswith("\n"))

    def test_main_returns_none(self):
        with patch("builtins.print"):
            result = main()
        self.assertIsNone(result)


if __name__ == "__main__":
    unittest.main()
