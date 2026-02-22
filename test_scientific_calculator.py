"""
Comprehensive tests for ScientificCalculator.
"""

import math
import pytest

from scientific_calculator import CalculatorError, ScientificCalculator


@pytest.fixture
def calc():
    return ScientificCalculator()


# ── Basic arithmetic ──────────────────────────────────────────────────────────

class TestAddition:
    def test_positive(self, calc):
        assert calc.add(3, 4) == 7

    def test_negative(self, calc):
        assert calc.add(-3, -4) == -7

    def test_mixed(self, calc):
        assert calc.add(-3, 4) == 1

    def test_floats(self, calc):
        assert calc.add(0.1, 0.2) == pytest.approx(0.3)

    def test_zero(self, calc):
        assert calc.add(0, 0) == 0

    def test_large(self, calc):
        assert calc.add(1e15, 1e15) == 2e15


class TestSubtraction:
    def test_positive(self, calc):
        assert calc.subtract(10, 3) == 7

    def test_negative_result(self, calc):
        assert calc.subtract(3, 10) == -7

    def test_floats(self, calc):
        assert calc.subtract(1.5, 0.5) == pytest.approx(1.0)

    def test_zero(self, calc):
        assert calc.subtract(5, 5) == 0


class TestMultiplication:
    def test_positive(self, calc):
        assert calc.multiply(3, 4) == 12

    def test_negative(self, calc):
        assert calc.multiply(-3, 4) == -12

    def test_zero(self, calc):
        assert calc.multiply(5, 0) == 0

    def test_floats(self, calc):
        assert calc.multiply(2.5, 4.0) == pytest.approx(10.0)

    def test_large(self, calc):
        assert calc.multiply(1e6, 1e6) == pytest.approx(1e12)


class TestDivision:
    def test_basic(self, calc):
        assert calc.divide(10, 2) == 5.0

    def test_float_result(self, calc):
        assert calc.divide(7, 2) == pytest.approx(3.5)

    def test_negative(self, calc):
        assert calc.divide(-10, 2) == -5.0

    def test_by_zero(self, calc):
        with pytest.raises(CalculatorError):
            calc.divide(5, 0)

    def test_fraction(self, calc):
        assert calc.divide(1, 3) == pytest.approx(1 / 3)


class TestModulo:
    def test_basic(self, calc):
        assert calc.modulo(10, 3) == 1

    def test_zero_remainder(self, calc):
        assert calc.modulo(9, 3) == 0

    def test_by_zero(self, calc):
        with pytest.raises(CalculatorError):
            calc.modulo(5, 0)

    def test_float(self, calc):
        assert calc.modulo(5.5, 2.0) == pytest.approx(1.5)


class TestPower:
    def test_square(self, calc):
        assert calc.power(3, 2) == 9

    def test_zero_exponent(self, calc):
        assert calc.power(5, 0) == 1

    def test_negative_exponent(self, calc):
        assert calc.power(2, -1) == pytest.approx(0.5)

    def test_fractional_exponent(self, calc):
        assert calc.power(8, 1 / 3) == pytest.approx(2.0)

    def test_zero_base(self, calc):
        assert calc.power(0, 5) == 0


class TestFloorDivide:
    def test_basic(self, calc):
        assert calc.floor_divide(10, 3) == 3

    def test_exact(self, calc):
        assert calc.floor_divide(9, 3) == 3

    def test_by_zero(self, calc):
        with pytest.raises(CalculatorError):
            calc.floor_divide(5, 0)


# ── Roots & logarithms ────────────────────────────────────────────────────────

class TestSqrt:
    def test_perfect_square(self, calc):
        assert calc.sqrt(9) == pytest.approx(3.0)

    def test_non_perfect(self, calc):
        assert calc.sqrt(2) == pytest.approx(math.sqrt(2))

    def test_zero(self, calc):
        assert calc.sqrt(0) == 0

    def test_negative_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.sqrt(-1)


class TestCbrt:
    def test_positive(self, calc):
        assert calc.cbrt(27) == pytest.approx(3.0)

    def test_negative(self, calc):
        assert calc.cbrt(-8) == pytest.approx(-2.0)

    def test_zero(self, calc):
        assert calc.cbrt(0) == 0


class TestNthRoot:
    def test_square_root(self, calc):
        assert calc.nth_root(16, 2) == pytest.approx(4.0)

    def test_cube_root(self, calc):
        assert calc.nth_root(27, 3) == pytest.approx(3.0)

    def test_negative_odd_root(self, calc):
        assert calc.nth_root(-27, 3) == pytest.approx(-3.0)

    def test_negative_even_root_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.nth_root(-4, 2)

    def test_zero_root_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.nth_root(8, 0)


class TestLogarithms:
    def test_log_natural(self, calc):
        assert calc.log(math.e) == pytest.approx(1.0)

    def test_log_base10(self, calc):
        assert calc.log(100, 10) == pytest.approx(2.0)

    def test_log_base2(self, calc):
        assert calc.log(8, 2) == pytest.approx(3.0)

    def test_log_zero_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.log(0)

    def test_log_negative_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.log(-1)

    def test_log_invalid_base_zero(self, calc):
        with pytest.raises(CalculatorError):
            calc.log(10, 0)

    def test_log_invalid_base_one(self, calc):
        with pytest.raises(CalculatorError):
            calc.log(10, 1)

    def test_log10(self, calc):
        assert calc.log10(1000) == pytest.approx(3.0)

    def test_log10_non_positive(self, calc):
        with pytest.raises(CalculatorError):
            calc.log10(0)

    def test_log2(self, calc):
        assert calc.log2(1024) == pytest.approx(10.0)

    def test_log2_non_positive(self, calc):
        with pytest.raises(CalculatorError):
            calc.log2(0)

    def test_exp(self, calc):
        assert calc.exp(1) == pytest.approx(math.e)

    def test_exp_zero(self, calc):
        assert calc.exp(0) == pytest.approx(1.0)

    def test_exp_negative(self, calc):
        assert calc.exp(-1) == pytest.approx(1 / math.e)


# ── Trigonometry ──────────────────────────────────────────────────────────────

class TestTrigonometry:
    def test_sin_zero(self, calc):
        assert calc.sin(0) == pytest.approx(0.0)

    def test_sin_pi_over_2(self, calc):
        assert calc.sin(math.pi / 2) == pytest.approx(1.0)

    def test_cos_zero(self, calc):
        assert calc.cos(0) == pytest.approx(1.0)

    def test_cos_pi(self, calc):
        assert calc.cos(math.pi) == pytest.approx(-1.0)

    def test_tan_zero(self, calc):
        assert calc.tan(0) == pytest.approx(0.0)

    def test_tan_pi_over_4(self, calc):
        assert calc.tan(math.pi / 4) == pytest.approx(1.0)

    def test_asin_one(self, calc):
        assert calc.asin(1) == pytest.approx(math.pi / 2)

    def test_asin_out_of_range(self, calc):
        with pytest.raises(CalculatorError):
            calc.asin(1.5)

    def test_acos_one(self, calc):
        assert calc.acos(1) == pytest.approx(0.0)

    def test_acos_out_of_range(self, calc):
        with pytest.raises(CalculatorError):
            calc.acos(-2)

    def test_atan_one(self, calc):
        assert calc.atan(1) == pytest.approx(math.pi / 4)

    def test_atan2(self, calc):
        assert calc.atan2(1, 1) == pytest.approx(math.pi / 4)


class TestHyperbolic:
    def test_sinh_zero(self, calc):
        assert calc.sinh(0) == pytest.approx(0.0)

    def test_cosh_zero(self, calc):
        assert calc.cosh(0) == pytest.approx(1.0)

    def test_tanh_zero(self, calc):
        assert calc.tanh(0) == pytest.approx(0.0)

    def test_tanh_bounds(self, calc):
        # tanh asymptotically approaches ±1; use a moderate value to stay strictly inside
        assert -1 < calc.tanh(0.5) < 1

    def test_asinh(self, calc):
        assert calc.asinh(0) == pytest.approx(0.0)

    def test_acosh_one(self, calc):
        assert calc.acosh(1) == pytest.approx(0.0)

    def test_acosh_less_than_one_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.acosh(0.5)

    def test_atanh_zero(self, calc):
        assert calc.atanh(0) == pytest.approx(0.0)

    def test_atanh_out_of_range(self, calc):
        with pytest.raises(CalculatorError):
            calc.atanh(1)


# ── Angle conversion ──────────────────────────────────────────────────────────

class TestAngleConversion:
    def test_deg_to_rad_180(self, calc):
        assert calc.degrees_to_radians(180) == pytest.approx(math.pi)

    def test_deg_to_rad_0(self, calc):
        assert calc.degrees_to_radians(0) == pytest.approx(0.0)

    def test_rad_to_deg_pi(self, calc):
        assert calc.radians_to_degrees(math.pi) == pytest.approx(180.0)

    def test_round_trip(self, calc):
        angle = 45.0
        assert calc.radians_to_degrees(calc.degrees_to_radians(angle)) == pytest.approx(angle)


# ── Number theory / combinatorics ─────────────────────────────────────────────

class TestFactorial:
    def test_zero(self, calc):
        assert calc.factorial(0) == 1

    def test_one(self, calc):
        assert calc.factorial(1) == 1

    def test_five(self, calc):
        assert calc.factorial(5) == 120

    def test_negative_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.factorial(-1)

    def test_float_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.factorial(3.5)


class TestGcdLcm:
    def test_gcd_basic(self, calc):
        assert calc.gcd(12, 8) == 4

    def test_gcd_coprime(self, calc):
        assert calc.gcd(7, 13) == 1

    def test_gcd_same(self, calc):
        assert calc.gcd(6, 6) == 6

    def test_lcm_basic(self, calc):
        assert calc.lcm(4, 6) == 12

    def test_lcm_coprime(self, calc):
        assert calc.lcm(7, 3) == 21

    def test_lcm_zero(self, calc):
        assert calc.lcm(0, 5) == 0


class TestPermutationsCombinations:
    def test_permutations(self, calc):
        assert calc.permutations(5, 3) == 60

    def test_permutations_zero_r(self, calc):
        assert calc.permutations(5, 0) == 1

    def test_permutations_r_gt_n_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.permutations(3, 5)

    def test_permutations_negative_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.permutations(-1, 2)

    def test_combinations(self, calc):
        assert calc.combinations(5, 2) == 10

    def test_combinations_zero_r(self, calc):
        assert calc.combinations(5, 0) == 1

    def test_combinations_n_eq_r(self, calc):
        assert calc.combinations(4, 4) == 1

    def test_combinations_r_gt_n_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.combinations(3, 5)


# ── Rounding & absolute value ─────────────────────────────────────────────────

class TestRoundingAbsolute:
    def test_absolute_positive(self, calc):
        assert calc.absolute(5) == 5

    def test_absolute_negative(self, calc):
        assert calc.absolute(-7) == 7

    def test_absolute_zero(self, calc):
        assert calc.absolute(0) == 0

    def test_floor(self, calc):
        assert calc.floor(3.9) == 3

    def test_floor_negative(self, calc):
        assert calc.floor(-2.1) == -3

    def test_ceil(self, calc):
        assert calc.ceil(3.1) == 4

    def test_ceil_negative(self, calc):
        assert calc.ceil(-2.9) == -2

    def test_round_value(self, calc):
        assert calc.round_value(3.567, 2) == 3.57

    def test_round_value_default(self, calc):
        assert calc.round_value(3.5) == 4


# ── Statistics ────────────────────────────────────────────────────────────────

class TestStatistics:
    def test_mean_basic(self, calc):
        assert calc.mean([1, 2, 3, 4, 5]) == pytest.approx(3.0)

    def test_mean_single(self, calc):
        assert calc.mean([42]) == pytest.approx(42.0)

    def test_mean_empty_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.mean([])

    def test_mean_negative(self, calc):
        assert calc.mean([-2, -4]) == pytest.approx(-3.0)

    def test_variance_basic(self, calc):
        assert calc.variance([2, 4, 4, 4, 5, 5, 7, 9]) == pytest.approx(4.0)

    def test_variance_single_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.variance([5])

    def test_variance_empty_raises(self, calc):
        with pytest.raises(CalculatorError):
            calc.variance([])

    def test_std_dev(self, calc):
        assert calc.std_dev([2, 4, 4, 4, 5, 5, 7, 9]) == pytest.approx(2.0)


# ── Complex numbers ───────────────────────────────────────────────────────────

class TestComplexNumbers:
    def test_complex_sqrt_positive(self, calc):
        result = calc.complex_sqrt(4)
        assert result == pytest.approx(2 + 0j)

    def test_complex_sqrt_negative(self, calc):
        result = calc.complex_sqrt(-1)
        assert result == pytest.approx(1j)


# ── Constants ─────────────────────────────────────────────────────────────────

class TestConstants:
    def test_pi(self, calc):
        assert calc.pi == pytest.approx(math.pi)

    def test_e(self, calc):
        assert calc.e == pytest.approx(math.e)

    def test_tau(self, calc):
        assert calc.tau == pytest.approx(2 * math.pi)


# ── Memory ────────────────────────────────────────────────────────────────────

class TestMemory:
    def test_store_and_recall(self, calc):
        calc.memory_store(42.0)
        assert calc.memory_recall() == 42.0

    def test_initial_memory_zero(self, calc):
        assert calc.memory_recall() == 0.0

    def test_memory_clear(self, calc):
        calc.memory_store(99)
        calc.memory_clear()
        assert calc.memory_recall() == 0.0

    def test_memory_add(self, calc):
        calc.memory_store(10)
        calc.memory_add(5)
        assert calc.memory_recall() == 15.0

    def test_memory_add_negative(self, calc):
        calc.memory_store(10)
        calc.memory_add(-3)
        assert calc.memory_recall() == 7.0


# ── History ───────────────────────────────────────────────────────────────────

class TestHistory:
    def test_history_records_operations(self, calc):
        calc.add(1, 2)
        calc.multiply(3, 4)
        history = calc.get_history()
        assert len(history) == 2
        assert "1 + 2 = 3" in history[0]
        assert "3 * 4 = 12" in history[1]

    def test_history_clear(self, calc):
        calc.add(1, 2)
        calc.clear_history()
        assert calc.get_history() == []

    def test_history_returns_copy(self, calc):
        calc.add(1, 2)
        h = calc.get_history()
        h.clear()
        assert len(calc.get_history()) == 1

    def test_fresh_instance_empty_history(self, calc):
        assert calc.get_history() == []


# ── Edge cases & integration ──────────────────────────────────────────────────

class TestEdgeCases:
    def test_chained_operations(self, calc):
        result = calc.add(calc.multiply(2, 3), calc.power(2, 3))
        assert result == pytest.approx(14.0)

    def test_trig_identity_sin_sq_plus_cos_sq(self, calc):
        angle = 1.234
        val = calc.add(calc.power(calc.sin(angle), 2), calc.power(calc.cos(angle), 2))
        assert val == pytest.approx(1.0)

    def test_log_exp_inverse(self, calc):
        x = 3.7
        assert calc.log(calc.exp(x)) == pytest.approx(x)

    def test_sqrt_power_identity(self, calc):
        assert calc.sqrt(calc.power(5, 2)) == pytest.approx(5.0)

    def test_large_factorial(self, calc):
        assert calc.factorial(10) == 3628800
