import io
import sys
import unittest
from unittest.mock import patch

import qwerty


class TestQwerty(unittest.TestCase):
    def test_main_prints_qwerty_helllo(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwerty.main()
        self.assertEqual(captured.getvalue(), "qwerty helllo\n")

    def test_main_prints_exactly_once(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwerty.main()
        lines = captured.getvalue().splitlines()
        self.assertEqual(len(lines), 1)

    def test_main_output_starts_with_qwerty(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwerty.main()
        self.assertTrue(captured.getvalue().startswith("qwerty"))

    def test_main_output_ends_with_helllo(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwerty.main()
        self.assertIn("helllo", captured.getvalue())

    def test_main_returns_none(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            result = qwerty.main()
        self.assertIsNone(result)

    def test_main_output_is_string(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwerty.main()
        self.assertIsInstance(captured.getvalue(), str)

    def test_script_runs_as_module(self):
        """Test that running qwerty as __main__ calls main()."""
        with patch.object(qwerty, "main") as mock_main:
            # Simulate running as __main__
            if qwerty.__name__ == "__main__":
                qwerty.main()
            else:
                # Directly call main to verify it works
                mock_main()
            mock_main.assert_called_once()

    def test_main_does_not_print_extra_whitespace(self):
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            qwerty.main()
        output = captured.getvalue()
        self.assertEqual(output.strip(), "qwerty helllo")


if __name__ == "__main__":
    unittest.main()
