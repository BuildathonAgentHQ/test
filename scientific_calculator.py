"""
Scientific Calculator
Supports basic arithmetic, trigonometry, logarithms, powers, and more.
"""

import math
import operator


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ValueError("Division by zero is undefined.")
    return a / b


def power(base, exp):
    return math.pow(base, exp)


def sqrt(x):
    if x < 0:
        raise ValueError("Cannot take square root of a negative number.")
    return math.sqrt(x)


def cbrt(x):
    return math.copysign(abs(x) ** (1 / 3), x)


def log(x, base=math.e):
    if x <= 0:
        raise ValueError("Logarithm is undefined for non-positive values.")
    if base <= 0 or base == 1:
        raise ValueError("Logarithm base must be positive and not equal to 1.")
    return math.log(x, base)


def log10(x):
    if x <= 0:
        raise ValueError("Logarithm is undefined for non-positive values.")
    return math.log10(x)


def log2(x):
    if x <= 0:
        raise ValueError("Logarithm is undefined for non-positive values.")
    return math.log2(x)


def sin(x, degrees=False):
    if degrees:
        x = math.radians(x)
    return math.sin(x)


def cos(x, degrees=False):
    if degrees:
        x = math.radians(x)
    return math.cos(x)


def tan(x, degrees=False):
    if degrees:
        x = math.radians(x)
    return math.tan(x)


def asin(x, degrees=False):
    if not -1 <= x <= 1:
        raise ValueError("asin input must be in [-1, 1].")
    result = math.asin(x)
    return math.degrees(result) if degrees else result


def acos(x, degrees=False):
    if not -1 <= x <= 1:
        raise ValueError("acos input must be in [-1, 1].")
    result = math.acos(x)
    return math.degrees(result) if degrees else result


def atan(x, degrees=False):
    result = math.atan(x)
    return math.degrees(result) if degrees else result


def atan2(y, x, degrees=False):
    result = math.atan2(y, x)
    return math.degrees(result) if degrees else result


def sinh(x):
    return math.sinh(x)


def cosh(x):
    return math.cosh(x)


def tanh(x):
    return math.tanh(x)


def factorial(n):
    if not isinstance(n, int) or n < 0:
        raise ValueError("Factorial is defined only for non-negative integers.")
    return math.factorial(n)


def permutation(n, r):
    if n < 0 or r < 0 or r > n:
        raise ValueError("Invalid values for permutation.")
    return math.factorial(n) // math.factorial(n - r)


def combination(n, r):
    if n < 0 or r < 0 or r > n:
        raise ValueError("Invalid values for combination.")
    return math.comb(n, r)


def absolute(x):
    return abs(x)


def floor(x):
    return math.floor(x)


def ceil(x):
    return math.ceil(x)


def mod(a, b):
    if b == 0:
        raise ValueError("Modulo by zero is undefined.")
    return a % b


def exp(x):
    return math.exp(x)


def gcd(a, b):
    return math.gcd(int(a), int(b))


def lcm(a, b):
    return abs(int(a) * int(b)) // math.gcd(int(a), int(b))


OPERATIONS = {
    # Arithmetic
    "add":        (add,        "add(a, b)         — Addition"),
    "subtract":   (subtract,   "subtract(a, b)    — Subtraction"),
    "multiply":   (multiply,   "multiply(a, b)    — Multiplication"),
    "divide":     (divide,     "divide(a, b)      — Division"),
    "mod":        (mod,        "mod(a, b)         — Modulo"),
    "power":      (power,      "power(base, exp)  — Exponentiation"),
    # Roots & exponential
    "sqrt":       (sqrt,       "sqrt(x)           — Square root"),
    "cbrt":       (cbrt,       "cbrt(x)           — Cube root"),
    "exp":        (exp,        "exp(x)            — e^x"),
    # Logarithms
    "log":        (log,        "log(x[, base])    — Natural log (or base-b log)"),
    "log10":      (log10,      "log10(x)          — Base-10 log"),
    "log2":       (log2,       "log2(x)           — Base-2 log"),
    # Trigonometry (radians by default)
    "sin":        (sin,        "sin(x[, deg])     — Sine"),
    "cos":        (cos,        "cos(x[, deg])     — Cosine"),
    "tan":        (tan,        "tan(x[, deg])     — Tangent"),
    "asin":       (asin,       "asin(x[, deg])    — Arc-sine"),
    "acos":       (acos,       "acos(x[, deg])    — Arc-cosine"),
    "atan":       (atan,       "atan(x[, deg])    — Arc-tangent"),
    "atan2":      (atan2,      "atan2(y, x[, deg])— Two-argument arc-tangent"),
    # Hyperbolic
    "sinh":       (sinh,       "sinh(x)           — Hyperbolic sine"),
    "cosh":       (cosh,       "cosh(x)           — Hyperbolic cosine"),
    "tanh":       (tanh,       "tanh(x)           — Hyperbolic tangent"),
    # Combinatorics
    "factorial":  (factorial,  "factorial(n)      — n!"),
    "permutation":(permutation,"permutation(n, r) — nPr"),
    "combination":(combination,"combination(n, r) — nCr"),
    # Misc
    "abs":        (absolute,   "abs(x)            — Absolute value"),
    "floor":      (floor,      "floor(x)          — Floor"),
    "ceil":       (ceil,       "ceil(x)           — Ceiling"),
    "gcd":        (gcd,        "gcd(a, b)         — Greatest common divisor"),
    "lcm":        (lcm,        "lcm(a, b)         — Least common multiple"),
}

CONSTANTS = {
    "pi":  math.pi,
    "e":   math.e,
    "tau": math.tau,
    "phi": (1 + math.sqrt(5)) / 2,   # Golden ratio
    "inf": math.inf,
}


def _parse_number(token: str) -> float:
    token = token.strip()
    if token in CONSTANTS:
        return CONSTANTS[token]
    return float(token)


def _print_help():
    print("\nConstants:", ", ".join(f"{k}={v:.6g}" for k, v in CONSTANTS.items()))
    print("\nOperations:")
    for desc in OPERATIONS.values():
        print(f"  {desc[1]}")
    print()


def run_interactive():
    print("=" * 60)
    print("       Scientific Calculator  (type 'help' or 'quit')")
    print("=" * 60)
    print("Enter an expression like:  add 3 4  |  sin 1.5708  |  log 100 10")
    print()

    while True:
        try:
            raw = input("calc> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not raw:
            continue

        lower = raw.lower()

        if lower in ("quit", "exit", "q"):
            print("Goodbye!")
            break

        if lower in ("help", "h", "?"):
            _print_help()
            continue

        tokens = raw.split()
        op_name = tokens[0].lower()

        if op_name not in OPERATIONS:
            print(f"  Unknown operation '{op_name}'. Type 'help' for a list.\n")
            continue

        func = OPERATIONS[op_name][0]

        try:
            args = [_parse_number(t) for t in tokens[1:]]
            result = func(*args)
            print(f"  = {result}\n")
        except TypeError as exc:
            print(f"  Argument error: {exc}\n")
        except ValueError as exc:
            print(f"  Math error: {exc}\n")
        except Exception as exc:
            print(f"  Error: {exc}\n")


if __name__ == "__main__":
    run_interactive()
