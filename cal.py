"""
Calculator module providing arithmetic and advanced mathematical operations.
"""

import math


class CalculatorError(Exception):
    """Base exception for Calculator errors."""


class DivisionByZeroError(CalculatorError):
    """Raised when division by zero is attempted."""


class NegativeSquareRootError(CalculatorError):
    """Raised when square root of a negative number is attempted."""


class Calculator:
    """
    A calculator supporting basic arithmetic, advanced math operations,
    memory storage, and operation history tracking.
    """

    def __init__(self):
        self._memory = 0
        self._history = []

    # ------------------------------------------------------------------
    # Basic arithmetic
    # ------------------------------------------------------------------

    def add(self, a, b):
        """Return a + b."""
        result = a + b
        self._record("add", a, b, result)
        return result

    def subtract(self, a, b):
        """Return a - b."""
        result = a - b
        self._record("subtract", a, b, result)
        return result

    def multiply(self, a, b):
        """Return a * b."""
        result = a * b
        self._record("multiply", a, b, result)
        return result

    def divide(self, a, b):
        """Return a / b. Raises DivisionByZeroError if b is zero."""
        if b == 0:
            raise DivisionByZeroError("Cannot divide by zero.")
        result = a / b
        self._record("divide", a, b, result)
        return result

    def floor_divide(self, a, b):
        """Return a // b. Raises DivisionByZeroError if b is zero."""
        if b == 0:
            raise DivisionByZeroError("Cannot divide by zero.")
        result = a // b
        self._record("floor_divide", a, b, result)
        return result

    def modulo(self, a, b):
        """Return a % b. Raises DivisionByZeroError if b is zero."""
        if b == 0:
            raise DivisionByZeroError("Cannot perform modulo by zero.")
        result = a % b
        self._record("modulo", a, b, result)
        return result

    # ------------------------------------------------------------------
    # Advanced operations
    # ------------------------------------------------------------------

    def power(self, base, exponent):
        """Return base ** exponent."""
        result = base ** exponent
        self._record("power", base, exponent, result)
        return result

    def square_root(self, a):
        """Return the square root of a. Raises NegativeSquareRootError if a < 0."""
        if a < 0:
            raise NegativeSquareRootError(
                f"Cannot compute square root of a negative number: {a}"
            )
        result = math.sqrt(a)
        self._record("square_root", a, None, result)
        return result

    def absolute(self, a):
        """Return the absolute value of a."""
        result = abs(a)
        self._record("absolute", a, None, result)
        return result

    def log(self, a, base=math.e):
        """Return the logarithm of a with the given base (default: natural log)."""
        if a <= 0:
            raise CalculatorError(
                f"Logarithm undefined for non-positive values: {a}"
            )
        if base <= 0 or base == 1:
            raise CalculatorError(f"Invalid logarithm base: {base}")
        result = math.log(a, base)
        self._record("log", a, base, result)
        return result

    def percentage(self, value, percent):
        """Return percent% of value."""
        result = (value * percent) / 100
        self._record("percentage", value, percent, result)
        return result

    # ------------------------------------------------------------------
    # Memory operations
    # ------------------------------------------------------------------

    def memory_store(self, value):
        """Store a value in memory."""
        self._memory = value

    def memory_recall(self):
        """Recall the value stored in memory."""
        return self._memory

    def memory_clear(self):
        """Clear the memory (reset to 0)."""
        self._memory = 0

    def memory_add(self, value):
        """Add value to the current memory."""
        self._memory += value

    def memory_subtract(self, value):
        """Subtract value from the current memory."""
        self._memory -= value

    # ------------------------------------------------------------------
    # History
    # ------------------------------------------------------------------

    def get_history(self):
        """Return a copy of the operation history."""
        return list(self._history)

    def clear_history(self):
        """Clear the operation history."""
        self._history.clear()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _record(self, operation, operand_a, operand_b, result):
        entry = {
            "operation": operation,
            "operand_a": operand_a,
            "operand_b": operand_b,
            "result": result,
        }
        self._history.append(entry)
