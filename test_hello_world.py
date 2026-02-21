import subprocess
import sys
import unittest


class TestHelloWorld(unittest.TestCase):
    def _run_script(self):
        """Execute hello_world.py in a subprocess and return CompletedProcess."""
        return subprocess.run(
            [sys.executable, "hello_world.py"],
            capture_output=True,
            text=True,
        )

    def test_prints_hello(self):
        """hello_world.py should print exactly 'hello' to stdout."""
        result = self._run_script()
        self.assertEqual(result.stdout.strip(), "hello")

    def test_no_stderr_output(self):
        """hello_world.py should not write anything to stderr."""
        result = self._run_script()
        self.assertEqual(result.stderr, "")

    def test_exits_successfully(self):
        """hello_world.py should exit with code 0."""
        result = self._run_script()
        self.assertEqual(result.returncode, 0)

    def test_output_is_single_line(self):
        """hello_world.py should print exactly one non-empty line."""
        result = self._run_script()
        lines = [line for line in result.stdout.splitlines() if line]
        self.assertEqual(len(lines), 1)


if __name__ == "__main__":
    unittest.main()
