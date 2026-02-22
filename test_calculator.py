"""
Comprehensive tests for calculator.py
"""

import math
import pytest
from calculator import Calculator


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def calc():
    """Return a fresh Calculator instance for each test."""
    return Calculator()


# ---------------------------------------------------------------------------
# Addition
# ---------------------------------------------------------------------------

class TestAdd:
    def test_positive_integers(self, calc):
        assert calc.add(3, 5) == 8

    def test_negative_integers(self, calc):
        assert calc.add(-3, -5) == -8

    def test_mixed_sign(self, calc):
        assert calc.add(-3, 5) == 2

    def test_floats(self, calc):
        assert calc.add(1.1, 2.2) == pytest.approx(3.3)

    def test_zero(self, calc):
        assert calc.add(0, 0) == 0

    def test_large_numbers(self, calc):
        assert calc.add(10**9, 10**9) == 2 * 10**9


# ---------------------------------------------------------------------------
# Subtraction
# ---------------------------------------------------------------------------

class TestSubtract:
    def test_positive_result(self, calc):
        assert calc.subtract(10, 4) == 6

    def test_negative_result(self, calc):
        assert calc.subtract(4, 10) == -6

    def test_zero_result(self, calc):
        assert calc.subtract(5, 5) == 0

    def test_floats(self, calc):
        assert calc.subtract(3.5, 1.2) == pytest.approx(2.3)

    def test_negative_operands(self, calc):
        assert calc.subtract(-3, -5) == 2


# ---------------------------------------------------------------------------
# Multiplication
# ---------------------------------------------------------------------------

class TestMultiply:
    def test_positive(self, calc):
        assert calc.multiply(4, 5) == 20

    def test_by_zero(self, calc):
        assert calc.multiply(100, 0) == 0

    def test_negative(self, calc):
        assert calc.multiply(-4, 5) == -20

    def test_both_negative(self, calc):
        assert calc.multiply(-4, -5) == 20

    def test_floats(self, calc):
        assert calc.multiply(2.5, 4.0) == pytest.approx(10.0)

    def test_large_numbers(self, calc):
        assert calc.multiply(10**6, 10**6) == 10**12


# ---------------------------------------------------------------------------
# Division
# ---------------------------------------------------------------------------

class TestDivide:
    def test_exact(self, calc):
        assert calc.divide(10, 2) == 5.0

    def test_float_result(self, calc):
        assert calc.divide(7, 2) == pytest.approx(3.5)

    def test_negative_dividend(self, calc):
        assert calc.divide(-10, 2) == -5.0

    def test_negative_divisor(self, calc):
        assert calc.divide(10, -2) == -5.0

    def test_both_negative(self, calc):
        assert calc.divide(-10, -2) == 5.0

    def test_zero_dividend(self, calc):
        assert calc.divide(0, 5) == 0.0

    def test_divide_by_zero_raises(self, calc):
        with pytest.raises(ZeroDivisionError):
            calc.divide(5, 0)

    def test_float_divisor(self, calc):
        assert calc.divide(1, 0.5) == pytest.approx(2.0)


# ---------------------------------------------------------------------------
# Floor Division
# ---------------------------------------------------------------------------

class TestFloorDivide:
    def test_exact(self, calc):
        assert calc.floor_divide(10, 2) == 5

    def test_truncation(self, calc):
        assert calc.floor_divide(7, 2) == 3

    def test_negative(self, calc):
        assert calc.floor_divide(-7, 2) == -4  # floor towards negative infinity

    def test_divide_by_zero_raises(self, calc):
        with pytest.raises(ZeroDivisionError):
            calc.floor_divide(7, 0)


# ---------------------------------------------------------------------------
# Modulo
# ---------------------------------------------------------------------------

class TestModulo:
    def test_basic(self, calc):
        assert calc.modulo(10, 3) == 1

    def test_exact_divisible(self, calc):
        assert calc.modulo(9, 3) == 0

    def test_modulo_by_zero_raises(self, calc):
        with pytest.raises(ZeroDivisionError):
            calc.modulo(5, 0)

    def test_negative_dividend(self, calc):
        # Python modulo: sign follows divisor
        assert calc.modulo(-7, 3) == 2

    def test_float(self, calc):
        assert calc.modulo(10.5, 3) == pytest.approx(1.5)


# ---------------------------------------------------------------------------
# Power
# ---------------------------------------------------------------------------

class TestPower:
    def test_positive_exponent(self, calc):
        assert calc.power(2, 10) == 1024

    def test_zero_exponent(self, calc):
        assert calc.power(5, 0) == 1

    def test_one_exponent(self, calc):
        assert calc.power(7, 1) == 7

    def test_negative_exponent(self, calc):
        assert calc.power(2, -1) == pytest.approx(0.5)

    def test_fractional_exponent(self, calc):
        assert calc.power(4, 0.5) == pytest.approx(2.0)

    def test_zero_base(self, calc):
        assert calc.power(0, 5) == 0


# ---------------------------------------------------------------------------
# Square Root
# ---------------------------------------------------------------------------

class TestSqrt:
    def test_perfect_square(self, calc):
        assert calc.sqrt(9) == pytest.approx(3.0)

    def test_zero(self, calc):
        assert calc.sqrt(0) == 0.0

    def test_non_perfect_square(self, calc):
        assert calc.sqrt(2) == pytest.approx(math.sqrt(2))

    def test_float_input(self, calc):
        assert calc.sqrt(0.25) == pytest.approx(0.5)

    def test_negative_raises(self, calc):
        with pytest.raises(ValueError):
            calc.sqrt(-1)


# ---------------------------------------------------------------------------
# Logarithm
# ---------------------------------------------------------------------------

class TestLog:
    def test_natural_log(self, calc):
        assert calc.log(math.e) == pytest.approx(1.0)

    def test_log_base_10(self, calc):
        assert calc.log(100, 10) == pytest.approx(2.0)

    def test_log_base_2(self, calc):
        assert calc.log(8, 2) == pytest.approx(3.0)

    def test_log_of_one(self, calc):
        assert calc.log(1) == pytest.approx(0.0)

    def test_log_non_positive_raises(self, calc):
        with pytest.raises(ValueError):
            calc.log(0)

    def test_log_negative_raises(self, calc):
        with pytest.raises(ValueError):
            calc.log(-5)

    def test_invalid_base_zero_raises(self, calc):
        with pytest.raises(ValueError):
            calc.log(10, 0)

    def test_invalid_base_one_raises(self, calc):
        with pytest.raises(ValueError):
            calc.log(10, 1)

    def test_invalid_base_negative_raises(self, calc):
        with pytest.raises(ValueError):
            calc.log(10, -2)


class TestLog10:
    def test_hundred(self, calc):
        assert calc.log10(100) == pytest.approx(2.0)

    def test_one(self, calc):
        assert calc.log10(1) == pytest.approx(0.0)

    def test_non_positive_raises(self, calc):
        with pytest.raises(ValueError):
            calc.log10(0)


# ---------------------------------------------------------------------------
# Absolute Value
# ---------------------------------------------------------------------------

class TestAbsVal:
    def test_positive(self, calc):
        assert calc.abs_val(5) == 5

    def test_negative(self, calc):
        assert calc.abs_val(-5) == 5

    def test_zero(self, calc):
        assert calc.abs_val(0) == 0

    def test_float(self, calc):
        assert calc.abs_val(-3.14) == pytest.approx(3.14)


# ---------------------------------------------------------------------------
# Factorial
# ---------------------------------------------------------------------------

class TestFactorial:
    def test_zero(self, calc):
        assert calc.factorial(0) == 1

    def test_one(self, calc):
        assert calc.factorial(1) == 1

    def test_five(self, calc):
        assert calc.factorial(5) == 120

    def test_ten(self, calc):
        assert calc.factorial(10) == 3628800

    def test_negative_raises(self, calc):
        with pytest.raises(ValueError):
            calc.factorial(-1)

    def test_float_raises(self, calc):
        with pytest.raises(ValueError):
            calc.factorial(3.5)


# ---------------------------------------------------------------------------
# History
# ---------------------------------------------------------------------------

class TestHistory:
    def test_empty_initially(self, calc):
        assert calc.get_history() == []

    def test_records_operations(self, calc):
        calc.add(1, 2)
        calc.multiply(3, 4)
        history = calc.get_history()
        assert len(history) == 2

    def test_history_content(self, calc):
        calc.add(1, 2)
        entry = calc.get_history()[0]
        assert entry["result"] == 3
        assert "1" in entry["expression"] and "2" in entry["expression"]

    def test_history_is_copy(self, calc):
        calc.add(1, 1)
        h = calc.get_history()
        h.clear()
        assert len(calc.get_history()) == 1

    def test_clear_history(self, calc):
        calc.add(1, 2)
        calc.clear_history()
        assert calc.get_history() == []

    def test_last_result_none_when_empty(self, calc):
        assert calc.last_result() is None

    def test_last_result_after_operations(self, calc):
        calc.add(2, 3)
        calc.multiply(4, 5)
        assert calc.last_result() == 20

    def test_last_result_updated_each_call(self, calc):
        calc.add(1, 1)
        assert calc.last_result() == 2
        calc.add(10, 10)
        assert calc.last_result() == 20

    def test_multiple_operations_recorded(self, calc):
        ops = [
            calc.add(1, 2),
            calc.subtract(10, 4),
            calc.multiply(3, 3),
            calc.divide(8, 2),
        ]
        assert len(calc.get_history()) == 4
        assert ops == [3, 6, 9, 4.0]


# ---------------------------------------------------------------------------
# Edge / Integration cases
# ---------------------------------------------------------------------------

class TestEdgeCases:
    def test_chained_operations(self, calc):
        """Use result of one operation as input to the next."""
        r1 = calc.add(3, 7)         # 10
        r2 = calc.multiply(r1, 2)   # 20
        r3 = calc.subtract(r2, 5)   # 15
        r4 = calc.divide(r3, 3)     # 5.0
        assert r4 == pytest.approx(5.0)
        assert len(calc.get_history()) == 4

    def test_very_small_floats(self, calc):
        result = calc.add(1e-15, 2e-15)
        assert result == pytest.approx(3e-15)

    def test_very_large_floats(self, calc):
        result = calc.multiply(1e150, 1e100)
        assert result == pytest.approx(1e250)

    def test_sqrt_then_power_identity(self, calc):
        """sqrt(x) ** 2 should equal x."""
        x = 7.0
        root = calc.sqrt(x)
        result = calc.power(root, 2)
        assert result == pytest.approx(x)

    def test_log_exp_identity(self, calc):
        """log(e^x) should equal x."""
        x = 3.5
        result = calc.log(math.exp(x))
        assert result == pytest.approx(x)
