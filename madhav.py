"""
Simple Calculator - madhav.py

Supports basic arithmetic operations: add, subtract, multiply, divide,
as well as modulo, power, and square root.
"""

import math


def add(a, b):
    """Return the sum of a and b."""
    return a + b


def subtract(a, b):
    """Return the difference of a and b."""
    return a - b


def multiply(a, b):
    """Return the product of a and b."""
    return a * b


def divide(a, b):
    """Return the quotient of a divided by b.

    Raises:
        ZeroDivisionError: If b is zero.
    """
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero.")
    return a / b


def modulo(a, b):
    """Return the remainder of a divided by b.

    Raises:
        ZeroDivisionError: If b is zero.
    """
    if b == 0:
        raise ZeroDivisionError("Cannot take modulo with zero.")
    return a % b


def power(base, exp):
    """Return base raised to the power of exp."""
    return base ** exp


def square_root(n):
    """Return the square root of n.

    Raises:
        ValueError: If n is negative.
    """
    if n < 0:
        raise ValueError("Cannot take the square root of a negative number.")
    return math.sqrt(n)


def calculator(a, operator, b=None):
    """Evaluate a calculator expression.

    Args:
        a: First operand (number).
        operator: One of '+', '-', '*', '/', '%', '**', 'sqrt'.
        b: Second operand (required for all operators except 'sqrt').

    Returns:
        The result of the operation.

    Raises:
        ValueError: For an unsupported operator or missing operand.
        ZeroDivisionError: For division or modulo by zero.
    """
    ops = {
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
        "%": modulo,
        "**": power,
    }

    if operator == "sqrt":
        return square_root(a)

    if operator not in ops:
        raise ValueError(f"Unsupported operator: '{operator}'")

    if b is None:
        raise ValueError(f"Operator '{operator}' requires a second operand.")

    return ops[operator](a, b)


if __name__ == "__main__":
    print("Simple Calculator")
    print("-----------------")
    examples = [
        (10, "+", 5),
        (10, "-", 3),
        (4, "*", 7),
        (20, "/", 4),
        (17, "%", 5),
        (2, "**", 10),
        (16, "sqrt", None),
    ]
    for expr in examples:
        a, op, b = expr
        if op == "sqrt":
            result = calculator(a, op)
            print(f"sqrt({a}) = {result}")
        else:
            result = calculator(a, op, b)
            print(f"{a} {op} {b} = {result}")
