"""
Unit tests for scientific_calculator.py
"""

import math
import unittest

from scientific_calculator import (
    CONSTANTS,
    OPERATIONS,
    _parse_number,
    absolute,
    acos,
    add,
    asin,
    atan,
    atan2,
    cbrt,
    ceil,
    combination,
    cos,
    cosh,
    divide,
    exp,
    factorial,
    floor,
    gcd,
    lcm,
    log,
    log2,
    log10,
    mod,
    multiply,
    permutation,
    power,
    sin,
    sinh,
    sqrt,
    subtract,
    tan,
    tanh,
)


class TestArithmetic(unittest.TestCase):
    def test_add_integers(self):
        self.assertEqual(add(3, 4), 7)

    def test_add_floats(self):
        self.assertAlmostEqual(add(1.1, 2.2), 3.3, places=10)

    def test_add_negative(self):
        self.assertEqual(add(-5, 3), -2)

    def test_add_zeros(self):
        self.assertEqual(add(0, 0), 0)

    def test_subtract_basic(self):
        self.assertEqual(subtract(10, 4), 6)

    def test_subtract_negative_result(self):
        self.assertEqual(subtract(3, 7), -4)

    def test_subtract_floats(self):
        self.assertAlmostEqual(subtract(5.5, 2.2), 3.3, places=10)

    def test_multiply_basic(self):
        self.assertEqual(multiply(3, 4), 12)

    def test_multiply_by_zero(self):
        self.assertEqual(multiply(100, 0), 0)

    def test_multiply_negatives(self):
        self.assertEqual(multiply(-3, -4), 12)

    def test_multiply_float(self):
        self.assertAlmostEqual(multiply(2.5, 4), 10.0)

    def test_divide_basic(self):
        self.assertAlmostEqual(divide(10, 4), 2.5)

    def test_divide_exact(self):
        self.assertEqual(divide(9, 3), 3.0)

    def test_divide_by_zero_raises(self):
        with self.assertRaises(ValueError):
            divide(5, 0)

    def test_divide_negative(self):
        self.assertAlmostEqual(divide(-6, 2), -3.0)

    def test_mod_basic(self):
        self.assertEqual(mod(10, 3), 1)

    def test_mod_exact(self):
        self.assertEqual(mod(9, 3), 0)

    def test_mod_by_zero_raises(self):
        with self.assertRaises(ValueError):
            mod(5, 0)

    def test_mod_float(self):
        self.assertAlmostEqual(mod(5.5, 2.0), 1.5)


class TestPowerAndRoots(unittest.TestCase):
    def test_power_basic(self):
        self.assertAlmostEqual(power(2, 10), 1024.0)

    def test_power_zero_exp(self):
        self.assertAlmostEqual(power(5, 0), 1.0)

    def test_power_fractional_exp(self):
        self.assertAlmostEqual(power(4, 0.5), 2.0)

    def test_power_negative_base(self):
        self.assertAlmostEqual(power(-2, 3), -8.0)

    def test_sqrt_perfect_square(self):
        self.assertAlmostEqual(sqrt(9), 3.0)

    def test_sqrt_zero(self):
        self.assertAlmostEqual(sqrt(0), 0.0)

    def test_sqrt_non_perfect(self):
        self.assertAlmostEqual(sqrt(2), math.sqrt(2))

    def test_sqrt_negative_raises(self):
        with self.assertRaises(ValueError):
            sqrt(-1)

    def test_cbrt_positive(self):
        self.assertAlmostEqual(cbrt(8), 2.0)

    def test_cbrt_zero(self):
        self.assertAlmostEqual(cbrt(0), 0.0)

    def test_cbrt_negative(self):
        self.assertAlmostEqual(cbrt(-27), -3.0)

    def test_cbrt_non_perfect(self):
        self.assertAlmostEqual(cbrt(2), 2 ** (1 / 3))

    def test_exp_zero(self):
        self.assertAlmostEqual(exp(0), 1.0)

    def test_exp_one(self):
        self.assertAlmostEqual(exp(1), math.e)

    def test_exp_negative(self):
        self.assertAlmostEqual(exp(-1), 1 / math.e)


class TestLogarithms(unittest.TestCase):
    def test_log_natural(self):
        self.assertAlmostEqual(log(math.e), 1.0)

    def test_log_with_base(self):
        self.assertAlmostEqual(log(100, 10), 2.0)

    def test_log_base_2(self):
        self.assertAlmostEqual(log(8, 2), 3.0)

    def test_log_non_positive_raises(self):
        with self.assertRaises(ValueError):
            log(0)

    def test_log_negative_raises(self):
        with self.assertRaises(ValueError):
            log(-1)

    def test_log_invalid_base_zero_raises(self):
        with self.assertRaises(ValueError):
            log(10, 0)

    def test_log_invalid_base_one_raises(self):
        with self.assertRaises(ValueError):
            log(10, 1)

    def test_log_invalid_base_negative_raises(self):
        with self.assertRaises(ValueError):
            log(10, -2)

    def test_log10_basic(self):
        self.assertAlmostEqual(log10(100), 2.0)

    def test_log10_one(self):
        self.assertAlmostEqual(log10(1), 0.0)

    def test_log10_non_positive_raises(self):
        with self.assertRaises(ValueError):
            log10(0)

    def test_log10_negative_raises(self):
        with self.assertRaises(ValueError):
            log10(-5)

    def test_log2_basic(self):
        self.assertAlmostEqual(log2(8), 3.0)

    def test_log2_one(self):
        self.assertAlmostEqual(log2(1), 0.0)

    def test_log2_non_positive_raises(self):
        with self.assertRaises(ValueError):
            log2(0)

    def test_log2_negative_raises(self):
        with self.assertRaises(ValueError):
            log2(-1)


class TestTrigonometry(unittest.TestCase):
    def test_sin_zero(self):
        self.assertAlmostEqual(sin(0), 0.0)

    def test_sin_pi_over_2(self):
        self.assertAlmostEqual(sin(math.pi / 2), 1.0)

    def test_sin_degrees(self):
        self.assertAlmostEqual(sin(90, degrees=True), 1.0)

    def test_sin_degrees_180(self):
        self.assertAlmostEqual(sin(180, degrees=True), 0.0, places=10)

    def test_cos_zero(self):
        self.assertAlmostEqual(cos(0), 1.0)

    def test_cos_pi(self):
        self.assertAlmostEqual(cos(math.pi), -1.0)

    def test_cos_degrees(self):
        self.assertAlmostEqual(cos(0, degrees=True), 1.0)

    def test_cos_degrees_90(self):
        self.assertAlmostEqual(cos(90, degrees=True), 0.0, places=10)

    def test_tan_zero(self):
        self.assertAlmostEqual(tan(0), 0.0)

    def test_tan_45_degrees(self):
        self.assertAlmostEqual(tan(45, degrees=True), 1.0)

    def test_tan_pi_over_4(self):
        self.assertAlmostEqual(tan(math.pi / 4), 1.0)

    def test_asin_zero(self):
        self.assertAlmostEqual(asin(0), 0.0)

    def test_asin_one(self):
        self.assertAlmostEqual(asin(1), math.pi / 2)

    def test_asin_one_degrees(self):
        self.assertAlmostEqual(asin(1, degrees=True), 90.0)

    def test_asin_out_of_range_raises(self):
        with self.assertRaises(ValueError):
            asin(1.5)

    def test_asin_out_of_range_negative_raises(self):
        with self.assertRaises(ValueError):
            asin(-1.5)

    def test_acos_one(self):
        self.assertAlmostEqual(acos(1), 0.0)

    def test_acos_zero(self):
        self.assertAlmostEqual(acos(0), math.pi / 2)

    def test_acos_degrees(self):
        self.assertAlmostEqual(acos(0, degrees=True), 90.0)

    def test_acos_out_of_range_raises(self):
        with self.assertRaises(ValueError):
            acos(2.0)

    def test_atan_zero(self):
        self.assertAlmostEqual(atan(0), 0.0)

    def test_atan_one(self):
        self.assertAlmostEqual(atan(1), math.pi / 4)

    def test_atan_degrees(self):
        self.assertAlmostEqual(atan(1, degrees=True), 45.0)

    def test_atan2_basic(self):
        self.assertAlmostEqual(atan2(1, 1), math.pi / 4)

    def test_atan2_degrees(self):
        self.assertAlmostEqual(atan2(1, 1, degrees=True), 45.0)

    def test_atan2_negative_x(self):
        self.assertAlmostEqual(atan2(0, -1), math.pi)


class TestHyperbolic(unittest.TestCase):
    def test_sinh_zero(self):
        self.assertAlmostEqual(sinh(0), 0.0)

    def test_sinh_one(self):
        self.assertAlmostEqual(sinh(1), math.sinh(1))

    def test_sinh_negative(self):
        self.assertAlmostEqual(sinh(-1), -math.sinh(1))

    def test_cosh_zero(self):
        self.assertAlmostEqual(cosh(0), 1.0)

    def test_cosh_one(self):
        self.assertAlmostEqual(cosh(1), math.cosh(1))

    def test_cosh_symmetric(self):
        self.assertAlmostEqual(cosh(2), cosh(-2))

    def test_tanh_zero(self):
        self.assertAlmostEqual(tanh(0), 0.0)

    def test_tanh_large_positive(self):
        self.assertAlmostEqual(tanh(100), 1.0)

    def test_tanh_large_negative(self):
        self.assertAlmostEqual(tanh(-100), -1.0)


class TestCombinatorics(unittest.TestCase):
    def test_factorial_zero(self):
        self.assertEqual(factorial(0), 1)

    def test_factorial_one(self):
        self.assertEqual(factorial(1), 1)

    def test_factorial_five(self):
        self.assertEqual(factorial(5), 120)

    def test_factorial_ten(self):
        self.assertEqual(factorial(10), 3628800)

    def test_factorial_negative_raises(self):
        with self.assertRaises(ValueError):
            factorial(-1)

    def test_factorial_float_raises(self):
        with self.assertRaises(ValueError):
            factorial(3.5)

    def test_permutation_basic(self):
        self.assertEqual(permutation(5, 2), 20)

    def test_permutation_n_equals_r(self):
        self.assertEqual(permutation(4, 4), 24)

    def test_permutation_r_zero(self):
        self.assertEqual(permutation(5, 0), 1)

    def test_permutation_invalid_r_gt_n_raises(self):
        with self.assertRaises(ValueError):
            permutation(3, 5)

    def test_permutation_negative_n_raises(self):
        with self.assertRaises(ValueError):
            permutation(-1, 0)

    def test_permutation_negative_r_raises(self):
        with self.assertRaises(ValueError):
            permutation(5, -1)

    def test_combination_basic(self):
        self.assertEqual(combination(5, 2), 10)

    def test_combination_r_zero(self):
        self.assertEqual(combination(5, 0), 1)

    def test_combination_n_equals_r(self):
        self.assertEqual(combination(4, 4), 1)

    def test_combination_invalid_r_gt_n_raises(self):
        with self.assertRaises(ValueError):
            combination(3, 5)

    def test_combination_negative_n_raises(self):
        with self.assertRaises(ValueError):
            combination(-1, 0)

    def test_combination_negative_r_raises(self):
        with self.assertRaises(ValueError):
            combination(5, -1)


class TestMiscellaneous(unittest.TestCase):
    def test_absolute_positive(self):
        self.assertEqual(absolute(5), 5)

    def test_absolute_negative(self):
        self.assertEqual(absolute(-7), 7)

    def test_absolute_zero(self):
        self.assertEqual(absolute(0), 0)

    def test_floor_positive(self):
        self.assertEqual(floor(3.7), 3)

    def test_floor_negative(self):
        self.assertEqual(floor(-3.2), -4)

    def test_floor_integer(self):
        self.assertEqual(floor(5.0), 5)

    def test_ceil_positive(self):
        self.assertEqual(ceil(3.2), 4)

    def test_ceil_negative(self):
        self.assertEqual(ceil(-3.7), -3)

    def test_ceil_integer(self):
        self.assertEqual(ceil(5.0), 5)

    def test_gcd_basic(self):
        self.assertEqual(gcd(12, 8), 4)

    def test_gcd_coprime(self):
        self.assertEqual(gcd(7, 13), 1)

    def test_gcd_same_numbers(self):
        self.assertEqual(gcd(6, 6), 6)

    def test_gcd_with_zero(self):
        self.assertEqual(gcd(5, 0), 5)

    def test_lcm_basic(self):
        self.assertEqual(lcm(4, 6), 12)

    def test_lcm_coprime(self):
        self.assertEqual(lcm(7, 3), 21)

    def test_lcm_same_numbers(self):
        self.assertEqual(lcm(5, 5), 5)


class TestParseNumber(unittest.TestCase):
    def test_parse_integer_string(self):
        self.assertEqual(_parse_number("42"), 42.0)

    def test_parse_float_string(self):
        self.assertAlmostEqual(_parse_number("3.14"), 3.14)

    def test_parse_negative(self):
        self.assertEqual(_parse_number("-5"), -5.0)

    def test_parse_constant_pi(self):
        self.assertAlmostEqual(_parse_number("pi"), math.pi)

    def test_parse_constant_e(self):
        self.assertAlmostEqual(_parse_number("e"), math.e)

    def test_parse_constant_tau(self):
        self.assertAlmostEqual(_parse_number("tau"), math.tau)

    def test_parse_constant_phi(self):
        expected = (1 + math.sqrt(5)) / 2
        self.assertAlmostEqual(_parse_number("phi"), expected)

    def test_parse_constant_inf(self):
        self.assertEqual(_parse_number("inf"), math.inf)

    def test_parse_with_whitespace(self):
        self.assertEqual(_parse_number("  7  "), 7.0)

    def test_parse_invalid_raises(self):
        with self.assertRaises(ValueError):
            _parse_number("not_a_number")


class TestConstantsAndOperations(unittest.TestCase):
    def test_constants_pi(self):
        self.assertAlmostEqual(CONSTANTS["pi"], math.pi)

    def test_constants_e(self):
        self.assertAlmostEqual(CONSTANTS["e"], math.e)

    def test_constants_tau(self):
        self.assertAlmostEqual(CONSTANTS["tau"], math.tau)

    def test_constants_phi(self):
        self.assertAlmostEqual(CONSTANTS["phi"], (1 + math.sqrt(5)) / 2)

    def test_constants_inf(self):
        self.assertEqual(CONSTANTS["inf"], math.inf)

    def test_operations_contains_all_arithmetic(self):
        for op in ("add", "subtract", "multiply", "divide", "mod", "power"):
            self.assertIn(op, OPERATIONS)

    def test_operations_contains_roots(self):
        for op in ("sqrt", "cbrt", "exp"):
            self.assertIn(op, OPERATIONS)

    def test_operations_contains_logarithms(self):
        for op in ("log", "log10", "log2"):
            self.assertIn(op, OPERATIONS)

    def test_operations_contains_trig(self):
        for op in ("sin", "cos", "tan", "asin", "acos", "atan", "atan2"):
            self.assertIn(op, OPERATIONS)

    def test_operations_contains_hyperbolic(self):
        for op in ("sinh", "cosh", "tanh"):
            self.assertIn(op, OPERATIONS)

    def test_operations_contains_combinatorics(self):
        for op in ("factorial", "permutation", "combination"):
            self.assertIn(op, OPERATIONS)

    def test_operations_contains_misc(self):
        for op in ("abs", "floor", "ceil", "gcd", "lcm"):
            self.assertIn(op, OPERATIONS)

    def test_operations_callables(self):
        for name, (func, _) in OPERATIONS.items():
            self.assertTrue(callable(func), f"OPERATIONS['{name}'] function is not callable")


if __name__ == "__main__":
    unittest.main()
