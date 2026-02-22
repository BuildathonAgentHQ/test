"""
Comprehensive tests for madhav.py calculator module.
"""

import math
import pytest

from madhav import (
    add,
    subtract,
    multiply,
    divide,
    modulo,
    power,
    square_root,
    calculator,
)


# ---------------------------------------------------------------------------
# add()
# ---------------------------------------------------------------------------

class TestAdd:
    def test_positive_integers(self):
        assert add(3, 5) == 8

    def test_negative_integers(self):
        assert add(-4, -6) == -10

    def test_mixed_sign(self):
        assert add(-3, 7) == 4

    def test_floats(self):
        assert add(1.5, 2.5) == pytest.approx(4.0)

    def test_zero(self):
        assert add(0, 0) == 0
        assert add(5, 0) == 5

    def test_large_numbers(self):
        assert add(10**9, 10**9) == 2 * 10**9


# ---------------------------------------------------------------------------
# subtract()
# ---------------------------------------------------------------------------

class TestSubtract:
    def test_positive_integers(self):
        assert subtract(10, 4) == 6

    def test_negative_result(self):
        assert subtract(3, 7) == -4

    def test_negative_operands(self):
        assert subtract(-5, -3) == -2

    def test_floats(self):
        assert subtract(5.5, 2.2) == pytest.approx(3.3)

    def test_zero(self):
        assert subtract(0, 0) == 0
        assert subtract(5, 0) == 5


# ---------------------------------------------------------------------------
# multiply()
# ---------------------------------------------------------------------------

class TestMultiply:
    def test_positive_integers(self):
        assert multiply(3, 4) == 12

    def test_negative_integers(self):
        assert multiply(-3, 4) == -12
        assert multiply(-3, -4) == 12

    def test_by_zero(self):
        assert multiply(1000, 0) == 0

    def test_floats(self):
        assert multiply(2.5, 4.0) == pytest.approx(10.0)

    def test_identity(self):
        assert multiply(7, 1) == 7


# ---------------------------------------------------------------------------
# divide()
# ---------------------------------------------------------------------------

class TestDivide:
    def test_exact_division(self):
        assert divide(10, 2) == 5.0

    def test_float_result(self):
        assert divide(7, 2) == pytest.approx(3.5)

    def test_negative_numerator(self):
        assert divide(-9, 3) == -3.0

    def test_negative_denominator(self):
        assert divide(9, -3) == -3.0

    def test_both_negative(self):
        assert divide(-9, -3) == 3.0

    def test_divide_by_zero_raises(self):
        with pytest.raises(ZeroDivisionError):
            divide(5, 0)

    def test_zero_numerator(self):
        assert divide(0, 5) == 0.0


# ---------------------------------------------------------------------------
# modulo()
# ---------------------------------------------------------------------------

class TestModulo:
    def test_basic(self):
        assert modulo(17, 5) == 2

    def test_exact_multiple(self):
        assert modulo(20, 5) == 0

    def test_negative_dividend(self):
        # Python modulo follows the sign of the divisor
        assert modulo(-7, 3) == 2

    def test_modulo_by_zero_raises(self):
        with pytest.raises(ZeroDivisionError):
            modulo(10, 0)

    def test_floats(self):
        assert modulo(5.5, 2.0) == pytest.approx(1.5)


# ---------------------------------------------------------------------------
# power()
# ---------------------------------------------------------------------------

class TestPower:
    def test_basic(self):
        assert power(2, 10) == 1024

    def test_zero_exponent(self):
        assert power(999, 0) == 1

    def test_one_exponent(self):
        assert power(7, 1) == 7

    def test_negative_exponent(self):
        assert power(2, -1) == pytest.approx(0.5)

    def test_float_base(self):
        assert power(2.0, 3) == pytest.approx(8.0)

    def test_zero_base(self):
        assert power(0, 5) == 0


# ---------------------------------------------------------------------------
# square_root()
# ---------------------------------------------------------------------------

class TestSquareRoot:
    def test_perfect_square(self):
        assert square_root(9) == pytest.approx(3.0)

    def test_non_perfect_square(self):
        assert square_root(2) == pytest.approx(math.sqrt(2))

    def test_zero(self):
        assert square_root(0) == 0.0

    def test_float(self):
        assert square_root(6.25) == pytest.approx(2.5)

    def test_negative_raises(self):
        with pytest.raises(ValueError):
            square_root(-1)

    def test_large_number(self):
        assert square_root(10**6) == pytest.approx(1000.0)


# ---------------------------------------------------------------------------
# calculator() – dispatcher function
# ---------------------------------------------------------------------------

class TestCalculator:
    # binary operators via dispatcher
    def test_addition(self):
        assert calculator(3, "+", 4) == 7

    def test_subtraction(self):
        assert calculator(10, "-", 3) == 7

    def test_multiplication(self):
        assert calculator(6, "*", 7) == 42

    def test_division(self):
        assert calculator(20, "/", 4) == pytest.approx(5.0)

    def test_modulo(self):
        assert calculator(13, "%", 4) == 1

    def test_power(self):
        assert calculator(3, "**", 3) == 27

    # square root (unary)
    def test_sqrt(self):
        assert calculator(25, "sqrt") == pytest.approx(5.0)

    def test_sqrt_with_b_ignored(self):
        # b is not accepted for sqrt; only a matters
        assert calculator(49, "sqrt") == pytest.approx(7.0)

    # error cases
    def test_divide_by_zero(self):
        with pytest.raises(ZeroDivisionError):
            calculator(5, "/", 0)

    def test_sqrt_negative(self):
        with pytest.raises(ValueError):
            calculator(-4, "sqrt")

    def test_unsupported_operator(self):
        with pytest.raises(ValueError, match="Unsupported operator"):
            calculator(1, "//", 2)

    def test_missing_second_operand(self):
        with pytest.raises(ValueError, match="requires a second operand"):
            calculator(5, "+")

    def test_modulo_by_zero(self):
        with pytest.raises(ZeroDivisionError):
            calculator(10, "%", 0)

    # edge cases
    def test_float_operands(self):
        assert calculator(1.1, "+", 2.2) == pytest.approx(3.3)

    def test_negative_operands(self):
        assert calculator(-5, "*", -3) == 15

    def test_chained_results(self):
        # (3 + 7) * 2 = 20
        step1 = calculator(3, "+", 7)
        step2 = calculator(step1, "*", 2)
        assert step2 == 20
