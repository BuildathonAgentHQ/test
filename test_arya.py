"""
Unit tests for arya.py

arya.py is a script that prints "Hello World" to stdout.
These tests verify that the script produces the expected output.
"""

import io
import subprocess
import sys
import unittest
from unittest.mock import patch
import os


ARYA_PATH = os.path.join(os.path.dirname(__file__), "arya.py")


class TestAryaOutput(unittest.TestCase):
    """Tests for arya.py script output."""

    def test_prints_hello_world_via_subprocess(self):
        """Running arya.py as a script should print 'Hello World' to stdout."""
        result = subprocess.run(
            [sys.executable, ARYA_PATH],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.stdout.strip(), "Hello World")

    def test_no_stderr_output(self):
        """Running arya.py should produce no stderr output."""
        result = subprocess.run(
            [sys.executable, ARYA_PATH],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.stderr, "")

    def test_exit_code_zero(self):
        """Running arya.py should exit with code 0 (success)."""
        result = subprocess.run(
            [sys.executable, ARYA_PATH],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0)

    def test_output_contains_hello_world(self):
        """The script output should contain the string 'Hello World'."""
        result = subprocess.run(
            [sys.executable, ARYA_PATH],
            capture_output=True,
            text=True,
        )
        self.assertIn("Hello World", result.stdout)

    def test_prints_hello_world_via_exec(self):
        """Executing arya.py source with stdout captured should print 'Hello World'."""
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            with open(ARYA_PATH) as f:
                exec(f.read())
        self.assertEqual(captured.getvalue().strip(), "Hello World")


if __name__ == "__main__":
    unittest.main()
