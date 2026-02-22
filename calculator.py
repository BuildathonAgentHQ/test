#!/usr/bin/env python3
"""
Cool Calculator - A feature-rich calculator with basic and advanced math operations.
"""

import math
import cmath
import statistics
from functools import reduce
from typing import Union

Number = Union[int, float, complex]


# ─────────────────────────────────────────
# Basic Operations
# ─────────────────────────────────────────

def add(*args: Number) -> Number:
    """Add any number of values."""
    return sum(args)

def subtract(a: Number, b: Number) -> Number:
    """Subtract b from a."""
    return a - b

def multiply(*args: Number) -> Number:
    """Multiply any number of values."""
    return reduce(lambda x, y: x * y, args)

def divide(a: Number, b: Number) -> float:
    """Divide a by b."""
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero.")
    return a / b

def floor_divide(a: Number, b: Number) -> int:
    """Integer (floor) division."""
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero.")
    return a // b

def modulo(a: Number, b: Number) -> Number:
    """Return the remainder of a divided by b."""
    if b == 0:
        raise ZeroDivisionError("Cannot modulo by zero.")
    return a % b

def power(base: Number, exp: Number) -> Number:
    """Raise base to the power of exp."""
    return base ** exp


# ─────────────────────────────────────────
# Advanced Math
# ─────────────────────────────────────────

def square_root(n: Number) -> Number:
    """Return square root; handles negatives via complex numbers."""
    if isinstance(n, complex) or n < 0:
        return cmath.sqrt(n)
    return math.sqrt(n)

def nth_root(n: float, degree: float) -> float:
    """Return the nth root of a number."""
    if degree == 0:
        raise ValueError("Degree cannot be zero.")
    return n ** (1 / degree)

def absolute(n: Number) -> Number:
    """Return the absolute value."""
    return abs(n)

def factorial(n: int) -> int:
    """Return n! for non-negative integers."""
    if not isinstance(n, int) or n < 0:
        raise ValueError("Factorial requires a non-negative integer.")
    return math.factorial(n)

def fibonacci(n: int) -> list[int]:
    """Return the first n Fibonacci numbers."""
    if n <= 0:
        return []
    seq = [0, 1]
    for _ in range(2, n):
        seq.append(seq[-1] + seq[-2])
    return seq[:n]

def is_prime(n: int) -> bool:
    """Check if n is a prime number."""
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def gcd(*args: int) -> int:
    """Return the greatest common divisor of multiple integers."""
    return reduce(math.gcd, args)

def lcm(*args: int) -> int:
    """Return the least common multiple of multiple integers."""
    return reduce(lambda a, b: abs(a * b) // math.gcd(a, b), args)

def prime_factors(n: int) -> list[int]:
    """Return the prime factorization of n."""
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors


# ─────────────────────────────────────────
# Trigonometry
# ─────────────────────────────────────────

def sin_deg(degrees: float) -> float:
    return math.sin(math.radians(degrees))

def cos_deg(degrees: float) -> float:
    return math.cos(math.radians(degrees))

def tan_deg(degrees: float) -> float:
    return math.tan(math.radians(degrees))

def asin_deg(x: float) -> float:
    return math.degrees(math.asin(x))

def acos_deg(x: float) -> float:
    return math.degrees(math.acos(x))

def atan_deg(x: float) -> float:
    return math.degrees(math.atan(x))

def atan2_deg(y: float, x: float) -> float:
    return math.degrees(math.atan2(y, x))


# ─────────────────────────────────────────
# Logarithms & Exponentials
# ─────────────────────────────────────────

def log(n: float, base: float = math.e) -> float:
    """Logarithm with custom base (default: natural log)."""
    if n <= 0:
        raise ValueError("Logarithm requires a positive number.")
    return math.log(n, base)

def log2(n: float) -> float:
    return math.log2(n)

def log10(n: float) -> float:
    return math.log10(n)

def exp(n: float) -> float:
    """Return e raised to the power n."""
    return math.exp(n)


# ─────────────────────────────────────────
# Statistics
# ─────────────────────────────────────────

def mean(data: list[float]) -> float:
    return statistics.mean(data)

def median(data: list[float]) -> float:
    return statistics.median(data)

def mode(data: list) -> list:
    return statistics.multimode(data)

def std_dev(data: list[float]) -> float:
    return statistics.stdev(data)

def variance(data: list[float]) -> float:
    return statistics.variance(data)

def data_range(data: list[float]) -> float:
    return max(data) - min(data)

def percentile(data: list[float], p: float) -> float:
    """Return the p-th percentile of data (0–100)."""
    sorted_data = sorted(data)
    idx = (p / 100) * (len(sorted_data) - 1)
    lo, hi = int(idx), min(int(idx) + 1, len(sorted_data) - 1)
    return sorted_data[lo] + (idx - lo) * (sorted_data[hi] - sorted_data[lo])


# ─────────────────────────────────────────
# Number Theory & Conversions
# ─────────────────────────────────────────

def to_binary(n: int) -> str:
    return bin(n)

def to_octal(n: int) -> str:
    return oct(n)

def to_hex(n: int) -> str:
    return hex(n)

def from_binary(s: str) -> int:
    return int(s, 2)

def from_octal(s: str) -> int:
    return int(s, 8)

def from_hex(s: str) -> int:
    return int(s, 16)

def celsius_to_fahrenheit(c: float) -> float:
    return c * 9 / 5 + 32

def fahrenheit_to_celsius(f: float) -> float:
    return (f - 32) * 5 / 9

def degrees_to_radians(d: float) -> float:
    return math.radians(d)

def radians_to_degrees(r: float) -> float:
    return math.degrees(r)


# ─────────────────────────────────────────
# Financial Math
# ─────────────────────────────────────────

def compound_interest(principal: float, rate: float, n: int, t: float) -> float:
    """A = P(1 + r/n)^(nt). Rate as decimal (e.g., 0.05 for 5%)."""
    return principal * (1 + rate / n) ** (n * t)

def simple_interest(principal: float, rate: float, time: float) -> float:
    """SI = P * r * t. Rate as decimal."""
    return principal * rate * time

def present_value(fv: float, rate: float, periods: int) -> float:
    """PV = FV / (1 + r)^n."""
    return fv / (1 + rate) ** periods

def future_value(pv: float, rate: float, periods: int) -> float:
    """FV = PV * (1 + r)^n."""
    return pv * (1 + rate) ** periods


# ─────────────────────────────────────────
# Matrix Operations (2D lists)
# ─────────────────────────────────────────

def matrix_add(A: list[list[float]], B: list[list[float]]) -> list[list[float]]:
    return [[A[i][j] + B[i][j] for j in range(len(A[0]))] for i in range(len(A))]

def matrix_multiply(A: list[list[float]], B: list[list[float]]) -> list[list[float]]:
    rows_A, cols_A, cols_B = len(A), len(A[0]), len(B[0])
    return [
        [sum(A[i][k] * B[k][j] for k in range(cols_A)) for j in range(cols_B)]
        for i in range(rows_A)
    ]

def matrix_transpose(A: list[list[float]]) -> list[list[float]]:
    return [list(row) for row in zip(*A)]

def matrix_determinant_2x2(A: list[list[float]]) -> float:
    return A[0][0] * A[1][1] - A[0][1] * A[1][0]


# ─────────────────────────────────────────
# Interactive REPL
# ─────────────────────────────────────────

HELP_TEXT = """
╔══════════════════════════════════════════════════════════╗
║              Cool Calculator  🧮                         ║
╠══════════════════════════════════════════════════════════╣
║  Operators : + - * / // % **                             ║
║  Constants : pi, e, tau, inf                             ║
║  Functions : sqrt, cbrt, abs, factorial, log, log2,      ║
║              log10, exp, sin, cos, tan, asin, acos,      ║
║              atan, degrees, radians, gcd, lcm,           ║
║              isprime, fibonacci, mean, median, mode,     ║
║              stdev, variance                             ║
║  Type 'help' for this menu, 'quit' to exit               ║
╚══════════════════════════════════════════════════════════╝
"""

def _build_repl_env() -> dict:
    env = {
        # constants
        "pi": math.pi,
        "e": math.e,
        "tau": math.tau,
        "inf": math.inf,
        # basic
        "abs": abs,
        # advanced
        "sqrt": square_root,
        "cbrt": lambda x: nth_root(x, 3),
        "factorial": factorial,
        "fibonacci": fibonacci,
        "isprime": is_prime,
        "gcd": gcd,
        "lcm": lcm,
        "prime_factors": prime_factors,
        # trig (degree-based)
        "sin": sin_deg,
        "cos": cos_deg,
        "tan": tan_deg,
        "asin": asin_deg,
        "acos": acos_deg,
        "atan": atan_deg,
        "atan2": atan2_deg,
        "degrees": radians_to_degrees,
        "radians": degrees_to_radians,
        # log / exp
        "log": log,
        "log2": log2,
        "log10": log10,
        "exp": exp,
        # statistics
        "mean": mean,
        "median": median,
        "mode": mode,
        "stdev": std_dev,
        "variance": variance,
        "percentile": percentile,
        # conversions
        "to_binary": to_binary,
        "to_octal": to_octal,
        "to_hex": to_hex,
        "c2f": celsius_to_fahrenheit,
        "f2c": fahrenheit_to_celsius,
        # financial
        "compound_interest": compound_interest,
        "simple_interest": simple_interest,
        # matrix
        "matrix_add": matrix_add,
        "matrix_multiply": matrix_multiply,
        "matrix_transpose": matrix_transpose,
    }
    return env


def repl() -> None:
    print(HELP_TEXT)
    env = _build_repl_env()
    history: list[str] = []

    while True:
        try:
            expr = input("calc> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye!")
            break

        if not expr:
            continue
        if expr.lower() in ("quit", "exit", "q"):
            print("Bye!")
            break
        if expr.lower() == "help":
            print(HELP_TEXT)
            continue
        if expr.lower() == "history":
            for i, h in enumerate(history, 1):
                print(f"  {i}: {h}")
            continue

        try:
            result = eval(expr, {"__builtins__": {}}, env)  # noqa: S307
            print(f"  = {result}")
            history.append(f"{expr}  →  {result}")
            env["_"] = result  # last result accessible as _
        except ZeroDivisionError as exc:
            print(f"  Error: {exc}")
        except Exception as exc:
            print(f"  Error: {exc}")


# ─────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────

if __name__ == "__main__":
    repl()
