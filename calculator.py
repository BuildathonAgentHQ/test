"""
A simple calculator application supporting basic and advanced operations.
"""

import math


class Calculator:
    """A calculator with basic arithmetic and advanced math operations."""

    def __init__(self):
        self.history = []

    def _record(self, expression, result):
        self.history.append({"expression": expression, "result": result})
        return result

    # --- Basic Operations ---

    def add(self, a, b):
        """Return a + b."""
        return self._record(f"{a} + {b}", a + b)

    def subtract(self, a, b):
        """Return a - b."""
        return self._record(f"{a} - {b}", a - b)

    def multiply(self, a, b):
        """Return a * b."""
        return self._record(f"{a} * {b}", a * b)

    def divide(self, a, b):
        """Return a / b. Raises ZeroDivisionError when b is 0."""
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero.")
        return self._record(f"{a} / {b}", a / b)

    def floor_divide(self, a, b):
        """Return a // b (integer division). Raises ZeroDivisionError when b is 0."""
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero.")
        return self._record(f"{a} // {b}", a // b)

    def modulo(self, a, b):
        """Return a % b. Raises ZeroDivisionError when b is 0."""
        if b == 0:
            raise ZeroDivisionError("Cannot modulo by zero.")
        return self._record(f"{a} % {b}", a % b)

    def power(self, base, exp):
        """Return base ** exp."""
        return self._record(f"{base} ** {exp}", base ** exp)

    # --- Advanced Operations ---

    def sqrt(self, n):
        """Return the square root of n. Raises ValueError for negative n."""
        if n < 0:
            raise ValueError("Cannot take the square root of a negative number.")
        return self._record(f"sqrt({n})", math.sqrt(n))

    def log(self, n, base=math.e):
        """Return the logarithm of n with given base (default: natural log).
        Raises ValueError for non-positive n or base."""
        if n <= 0:
            raise ValueError("Logarithm is undefined for non-positive values.")
        if base <= 0 or base == 1:
            raise ValueError("Logarithm base must be positive and not equal to 1.")
        result = math.log(n, base)
        base_label = "e" if base == math.e else base
        return self._record(f"log_{base_label}({n})", result)

    def log10(self, n):
        """Return the base-10 logarithm of n."""
        if n <= 0:
            raise ValueError("Logarithm is undefined for non-positive values.")
        return self._record(f"log10({n})", math.log10(n))

    def abs_val(self, n):
        """Return the absolute value of n."""
        return self._record(f"|{n}|", abs(n))

    def factorial(self, n):
        """Return n!. Raises ValueError for negative or non-integer n."""
        if not isinstance(n, int) or n < 0:
            raise ValueError("Factorial is only defined for non-negative integers.")
        return self._record(f"{n}!", math.factorial(n))

    # --- History ---

    def get_history(self):
        """Return a copy of the calculation history."""
        return list(self.history)

    def clear_history(self):
        """Clear the calculation history."""
        self.history.clear()

    def last_result(self):
        """Return the result of the most recent calculation, or None."""
        if self.history:
            return self.history[-1]["result"]
        return None


def main():
    """Interactive command-line calculator."""
    calc = Calculator()
    ops = {
        "+": calc.add,
        "-": calc.subtract,
        "*": calc.multiply,
        "/": calc.divide,
        "//": calc.floor_divide,
        "%": calc.modulo,
        "**": calc.power,
    }

    print("Simple Calculator  (type 'quit' to exit, 'history' to see history)")
    print("Supported binary operators: +  -  *  /  //  %  **")
    print("Supported functions: sqrt(<n>)  log(<n>)  log10(<n>)  abs(<n>)  factorial(<n>)\n")

    while True:
        try:
            expr = input("calc> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not expr:
            continue
        if expr.lower() == "quit":
            print("Goodbye!")
            break
        if expr.lower() == "history":
            history = calc.get_history()
            if not history:
                print("  (no history yet)")
            for entry in history:
                print(f"  {entry['expression']} = {entry['result']}")
            continue

        # Try function calls first
        for fn_name, method in [
            ("sqrt", calc.sqrt),
            ("log10", calc.log10),
            ("log", calc.log),
            ("abs", calc.abs_val),
            ("factorial", calc.factorial),
        ]:
            if expr.startswith(fn_name + "(") and expr.endswith(")"):
                inner = expr[len(fn_name) + 1 : -1]
                try:
                    arg = float(inner) if "." in inner else int(inner)
                    result = method(arg)
                    print(f"  = {result}")
                except (ValueError, TypeError) as exc:
                    print(f"  Error: {exc}")
                break
        else:
            # Try binary operation (supports two-char operators like ** and //)
            parsed = False
            for op in ("**", "//", "+", "-", "*", "/", "%"):
                # find operator not at position 0 (to avoid unary minus)
                idx = expr.find(op, 1)
                if idx != -1:
                    left, right = expr[:idx].strip(), expr[idx + len(op) :].strip()
                    try:
                        a = float(left) if "." in left else int(left)
                        b = float(right) if "." in right else int(right)
                        result = ops[op](a, b)
                        print(f"  = {result}")
                    except ZeroDivisionError as exc:
                        print(f"  Error: {exc}")
                    except ValueError:
                        print("  Error: invalid number.")
                    parsed = True
                    break
            if not parsed:
                print("  Error: unrecognised expression.")


if __name__ == "__main__":
    main()
