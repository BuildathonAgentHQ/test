import io
import runpy
import subprocess
import sys
import unittest
from contextlib import redirect_stdout
from unittest.mock import patch


class TestCalOutput(unittest.TestCase):
    def test_prints_hello_world_subprocess(self):
        """cal.py should print 'Hello World' when run as a script."""
        result = subprocess.run(
            [sys.executable, "cal.py"],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout.strip(), "Hello World")

    def test_prints_hello_world_runpy(self):
        """cal.py should print 'Hello World' when executed via runpy."""
        buf = io.StringIO()
        with redirect_stdout(buf):
            runpy.run_path("cal.py", run_name="__main__")
        self.assertEqual(buf.getvalue().strip(), "Hello World")

    def test_no_stderr_output(self):
        """cal.py should not write anything to stderr."""
        result = subprocess.run(
            [sys.executable, "cal.py"],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.stderr, "")

    def test_output_ends_with_newline(self):
        """print() should append a trailing newline to the output."""
        result = subprocess.run(
            [sys.executable, "cal.py"],
            capture_output=True,
            text=True,
        )
        self.assertTrue(result.stdout.endswith("\n"))


if __name__ == "__main__":
    unittest.main()
