"""
Scientific Calculator

Provides basic arithmetic and advanced scientific operations.
"""

import math
import cmath


class CalculatorError(Exception):
    """Raised when an invalid operation is attempted."""


class ScientificCalculator:
    """A scientific calculator supporting arithmetic and scientific functions."""

    def __init__(self):
        self.history = []
        self.memory = 0.0

    # ── Basic arithmetic ──────────────────────────────────────────────────────

    def add(self, a: float, b: float) -> float:
        result = a + b
        self._record(f"{a} + {b} = {result}")
        return result

    def subtract(self, a: float, b: float) -> float:
        result = a - b
        self._record(f"{a} - {b} = {result}")
        return result

    def multiply(self, a: float, b: float) -> float:
        result = a * b
        self._record(f"{a} * {b} = {result}")
        return result

    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise CalculatorError("Division by zero is undefined.")
        result = a / b
        self._record(f"{a} / {b} = {result}")
        return result

    def modulo(self, a: float, b: float) -> float:
        if b == 0:
            raise CalculatorError("Modulo by zero is undefined.")
        result = a % b
        self._record(f"{a} % {b} = {result}")
        return result

    def power(self, base: float, exponent: float) -> float:
        result = base ** exponent
        self._record(f"{base} ^ {exponent} = {result}")
        return result

    def floor_divide(self, a: float, b: float) -> float:
        if b == 0:
            raise CalculatorError("Floor division by zero is undefined.")
        result = a // b
        self._record(f"{a} // {b} = {result}")
        return result

    # ── Roots & logarithms ────────────────────────────────────────────────────

    def sqrt(self, x: float) -> float:
        if x < 0:
            raise CalculatorError("Square root of a negative number is not real.")
        result = math.sqrt(x)
        self._record(f"sqrt({x}) = {result}")
        return result

    def cbrt(self, x: float) -> float:
        result = math.copysign(abs(x) ** (1 / 3), x)
        self._record(f"cbrt({x}) = {result}")
        return result

    def nth_root(self, x: float, n: float) -> float:
        if n == 0:
            raise CalculatorError("Zeroth root is undefined.")
        if x < 0 and n % 2 == 0:
            raise CalculatorError("Even root of a negative number is not real.")
        result = math.copysign(abs(x) ** (1 / n), x)
        self._record(f"nthroot({x}, {n}) = {result}")
        return result

    def log(self, x: float, base: float = math.e) -> float:
        if x <= 0:
            raise CalculatorError("Logarithm is undefined for non-positive values.")
        if base <= 0 or base == 1:
            raise CalculatorError("Logarithm base must be positive and not equal to 1.")
        result = math.log(x, base)
        self._record(f"log({x}, base={base}) = {result}")
        return result

    def log10(self, x: float) -> float:
        if x <= 0:
            raise CalculatorError("log10 is undefined for non-positive values.")
        result = math.log10(x)
        self._record(f"log10({x}) = {result}")
        return result

    def log2(self, x: float) -> float:
        if x <= 0:
            raise CalculatorError("log2 is undefined for non-positive values.")
        result = math.log2(x)
        self._record(f"log2({x}) = {result}")
        return result

    def exp(self, x: float) -> float:
        result = math.exp(x)
        self._record(f"exp({x}) = {result}")
        return result

    # ── Trigonometry (angles in radians) ─────────────────────────────────────

    def sin(self, x: float) -> float:
        result = math.sin(x)
        self._record(f"sin({x}) = {result}")
        return result

    def cos(self, x: float) -> float:
        result = math.cos(x)
        self._record(f"cos({x}) = {result}")
        return result

    def tan(self, x: float) -> float:
        result = math.tan(x)
        self._record(f"tan({x}) = {result}")
        return result

    def asin(self, x: float) -> float:
        if not -1 <= x <= 1:
            raise CalculatorError("asin input must be in [-1, 1].")
        result = math.asin(x)
        self._record(f"asin({x}) = {result}")
        return result

    def acos(self, x: float) -> float:
        if not -1 <= x <= 1:
            raise CalculatorError("acos input must be in [-1, 1].")
        result = math.acos(x)
        self._record(f"acos({x}) = {result}")
        return result

    def atan(self, x: float) -> float:
        result = math.atan(x)
        self._record(f"atan({x}) = {result}")
        return result

    def atan2(self, y: float, x: float) -> float:
        result = math.atan2(y, x)
        self._record(f"atan2({y}, {x}) = {result}")
        return result

    # ── Hyperbolic functions ──────────────────────────────────────────────────

    def sinh(self, x: float) -> float:
        result = math.sinh(x)
        self._record(f"sinh({x}) = {result}")
        return result

    def cosh(self, x: float) -> float:
        result = math.cosh(x)
        self._record(f"cosh({x}) = {result}")
        return result

    def tanh(self, x: float) -> float:
        result = math.tanh(x)
        self._record(f"tanh({x}) = {result}")
        return result

    def asinh(self, x: float) -> float:
        result = math.asinh(x)
        self._record(f"asinh({x}) = {result}")
        return result

    def acosh(self, x: float) -> float:
        if x < 1:
            raise CalculatorError("acosh input must be >= 1.")
        result = math.acosh(x)
        self._record(f"acosh({x}) = {result}")
        return result

    def atanh(self, x: float) -> float:
        if not -1 < x < 1:
            raise CalculatorError("atanh input must be in (-1, 1).")
        result = math.atanh(x)
        self._record(f"atanh({x}) = {result}")
        return result

    # ── Angle conversion ──────────────────────────────────────────────────────

    def degrees_to_radians(self, degrees: float) -> float:
        result = math.radians(degrees)
        self._record(f"deg2rad({degrees}) = {result}")
        return result

    def radians_to_degrees(self, radians: float) -> float:
        result = math.degrees(radians)
        self._record(f"rad2deg({radians}) = {result}")
        return result

    # ── Number-theory / combinatorics ─────────────────────────────────────────

    def factorial(self, n: int) -> int:
        if not isinstance(n, int) or n < 0:
            raise CalculatorError("Factorial is defined only for non-negative integers.")
        result = math.factorial(n)
        self._record(f"{n}! = {result}")
        return result

    def gcd(self, a: int, b: int) -> int:
        result = math.gcd(int(a), int(b))
        self._record(f"gcd({a}, {b}) = {result}")
        return result

    def lcm(self, a: int, b: int) -> int:
        if a == 0 or b == 0:
            return 0
        result = abs(int(a) * int(b)) // math.gcd(int(a), int(b))
        self._record(f"lcm({a}, {b}) = {result}")
        return result

    def permutations(self, n: int, r: int) -> int:
        if n < 0 or r < 0:
            raise CalculatorError("n and r must be non-negative integers.")
        if r > n:
            raise CalculatorError("r cannot be greater than n.")
        result = math.perm(n, r)
        self._record(f"P({n}, {r}) = {result}")
        return result

    def combinations(self, n: int, r: int) -> int:
        if n < 0 or r < 0:
            raise CalculatorError("n and r must be non-negative integers.")
        if r > n:
            raise CalculatorError("r cannot be greater than n.")
        result = math.comb(n, r)
        self._record(f"C({n}, {r}) = {result}")
        return result

    # ── Rounding & absolute value ─────────────────────────────────────────────

    def absolute(self, x: float) -> float:
        result = abs(x)
        self._record(f"abs({x}) = {result}")
        return result

    def floor(self, x: float) -> int:
        result = math.floor(x)
        self._record(f"floor({x}) = {result}")
        return result

    def ceil(self, x: float) -> int:
        result = math.ceil(x)
        self._record(f"ceil({x}) = {result}")
        return result

    def round_value(self, x: float, decimals: int = 0) -> float:
        result = round(x, decimals)
        self._record(f"round({x}, {decimals}) = {result}")
        return result

    # ── Statistical helpers ───────────────────────────────────────────────────

    def mean(self, values: list) -> float:
        if not values:
            raise CalculatorError("Cannot compute mean of an empty list.")
        result = sum(values) / len(values)
        self._record(f"mean({values}) = {result}")
        return result

    def variance(self, values: list) -> float:
        if len(values) < 2:
            raise CalculatorError("Variance requires at least two values.")
        m = sum(values) / len(values)
        result = sum((v - m) ** 2 for v in values) / len(values)
        self._record(f"variance({values}) = {result}")
        return result

    def std_dev(self, values: list) -> float:
        result = math.sqrt(self.variance(values))
        self._record(f"std_dev({values}) = {result}")
        return result

    # ── Complex-number support ────────────────────────────────────────────────

    def complex_sqrt(self, x: float) -> complex:
        result = cmath.sqrt(x)
        self._record(f"complex_sqrt({x}) = {result}")
        return result

    # ── Constants ─────────────────────────────────────────────────────────────

    @property
    def pi(self) -> float:
        return math.pi

    @property
    def e(self) -> float:
        return math.e

    @property
    def tau(self) -> float:
        return math.tau

    # ── Memory ────────────────────────────────────────────────────────────────

    def memory_store(self, value: float) -> None:
        self.memory = value

    def memory_recall(self) -> float:
        return self.memory

    def memory_clear(self) -> None:
        self.memory = 0.0

    def memory_add(self, value: float) -> None:
        self.memory += value

    # ── History ───────────────────────────────────────────────────────────────

    def get_history(self) -> list:
        return list(self.history)

    def clear_history(self) -> None:
        self.history.clear()

    # ── Internal ──────────────────────────────────────────────────────────────

    def _record(self, entry: str) -> None:
        self.history.append(entry)
