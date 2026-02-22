"""
Comprehensive tests for cal.py Calculator module.
"""

import math
import unittest

from cal import (
    Calculator,
    CalculatorError,
    DivisionByZeroError,
    NegativeSquareRootError,
)


class TestCalculatorAdd(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_add_positive_integers(self):
        self.assertEqual(self.calc.add(3, 4), 7)

    def test_add_negative_integers(self):
        self.assertEqual(self.calc.add(-3, -4), -7)

    def test_add_mixed_signs(self):
        self.assertEqual(self.calc.add(-3, 4), 1)

    def test_add_floats(self):
        self.assertAlmostEqual(self.calc.add(1.1, 2.2), 3.3, places=10)

    def test_add_zero(self):
        self.assertEqual(self.calc.add(0, 0), 0)
        self.assertEqual(self.calc.add(5, 0), 5)

    def test_add_large_numbers(self):
        self.assertEqual(self.calc.add(10**15, 10**15), 2 * 10**15)


class TestCalculatorSubtract(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_subtract_positive(self):
        self.assertEqual(self.calc.subtract(10, 3), 7)

    def test_subtract_resulting_negative(self):
        self.assertEqual(self.calc.subtract(3, 10), -7)

    def test_subtract_negatives(self):
        self.assertEqual(self.calc.subtract(-5, -3), -2)

    def test_subtract_floats(self):
        self.assertAlmostEqual(self.calc.subtract(5.5, 2.2), 3.3, places=10)

    def test_subtract_zero(self):
        self.assertEqual(self.calc.subtract(7, 0), 7)
        self.assertEqual(self.calc.subtract(0, 0), 0)

    def test_subtract_same_value(self):
        self.assertEqual(self.calc.subtract(42, 42), 0)


class TestCalculatorMultiply(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_multiply_positive(self):
        self.assertEqual(self.calc.multiply(3, 4), 12)

    def test_multiply_by_zero(self):
        self.assertEqual(self.calc.multiply(9999, 0), 0)

    def test_multiply_by_one(self):
        self.assertEqual(self.calc.multiply(7, 1), 7)

    def test_multiply_negatives(self):
        self.assertEqual(self.calc.multiply(-3, -4), 12)

    def test_multiply_mixed_signs(self):
        self.assertEqual(self.calc.multiply(-3, 4), -12)

    def test_multiply_floats(self):
        self.assertAlmostEqual(self.calc.multiply(2.5, 4.0), 10.0)

    def test_multiply_large(self):
        self.assertEqual(self.calc.multiply(10**6, 10**6), 10**12)


class TestCalculatorDivide(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_divide_positive(self):
        self.assertEqual(self.calc.divide(10, 2), 5.0)

    def test_divide_floats(self):
        self.assertAlmostEqual(self.calc.divide(7, 2), 3.5)

    def test_divide_negative(self):
        self.assertEqual(self.calc.divide(-10, 2), -5.0)

    def test_divide_both_negative(self):
        self.assertEqual(self.calc.divide(-10, -2), 5.0)

    def test_divide_by_zero_raises(self):
        with self.assertRaises(DivisionByZeroError):
            self.calc.divide(5, 0)

    def test_divide_zero_numerator(self):
        self.assertEqual(self.calc.divide(0, 5), 0.0)

    def test_divide_returns_float(self):
        result = self.calc.divide(4, 2)
        self.assertIsInstance(result, float)


class TestCalculatorFloorDivide(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_floor_divide_even(self):
        self.assertEqual(self.calc.floor_divide(10, 2), 5)

    def test_floor_divide_truncates(self):
        self.assertEqual(self.calc.floor_divide(7, 2), 3)

    def test_floor_divide_negative(self):
        self.assertEqual(self.calc.floor_divide(-7, 2), -4)

    def test_floor_divide_by_zero_raises(self):
        with self.assertRaises(DivisionByZeroError):
            self.calc.floor_divide(7, 0)


class TestCalculatorModulo(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_modulo_basic(self):
        self.assertEqual(self.calc.modulo(10, 3), 1)

    def test_modulo_no_remainder(self):
        self.assertEqual(self.calc.modulo(10, 5), 0)

    def test_modulo_by_zero_raises(self):
        with self.assertRaises(DivisionByZeroError):
            self.calc.modulo(10, 0)

    def test_modulo_negative_dividend(self):
        self.assertEqual(self.calc.modulo(-7, 3), 2)

    def test_modulo_larger_divisor(self):
        self.assertEqual(self.calc.modulo(3, 10), 3)


class TestCalculatorPower(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_power_positive_exponent(self):
        self.assertEqual(self.calc.power(2, 10), 1024)

    def test_power_zero_exponent(self):
        self.assertEqual(self.calc.power(999, 0), 1)

    def test_power_exponent_one(self):
        self.assertEqual(self.calc.power(7, 1), 7)

    def test_power_negative_exponent(self):
        self.assertAlmostEqual(self.calc.power(2, -1), 0.5)

    def test_power_fractional_exponent(self):
        self.assertAlmostEqual(self.calc.power(4, 0.5), 2.0)

    def test_power_zero_base(self):
        self.assertEqual(self.calc.power(0, 5), 0)

    def test_power_negative_base_even_exponent(self):
        self.assertEqual(self.calc.power(-2, 2), 4)

    def test_power_negative_base_odd_exponent(self):
        self.assertEqual(self.calc.power(-2, 3), -8)


class TestCalculatorSquareRoot(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_square_root_perfect_square(self):
        self.assertEqual(self.calc.square_root(9), 3.0)

    def test_square_root_zero(self):
        self.assertEqual(self.calc.square_root(0), 0.0)

    def test_square_root_float(self):
        self.assertAlmostEqual(self.calc.square_root(2), math.sqrt(2))

    def test_square_root_negative_raises(self):
        with self.assertRaises(NegativeSquareRootError):
            self.calc.square_root(-1)

    def test_square_root_large_number(self):
        self.assertAlmostEqual(self.calc.square_root(10**10), 10**5)


class TestCalculatorAbsolute(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_absolute_positive(self):
        self.assertEqual(self.calc.absolute(5), 5)

    def test_absolute_negative(self):
        self.assertEqual(self.calc.absolute(-5), 5)

    def test_absolute_zero(self):
        self.assertEqual(self.calc.absolute(0), 0)

    def test_absolute_float(self):
        self.assertAlmostEqual(self.calc.absolute(-3.14), 3.14)


class TestCalculatorLog(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_log_natural(self):
        self.assertAlmostEqual(self.calc.log(math.e), 1.0)

    def test_log_base10(self):
        self.assertAlmostEqual(self.calc.log(100, 10), 2.0)

    def test_log_base2(self):
        self.assertAlmostEqual(self.calc.log(8, 2), 3.0)

    def test_log_one_is_zero(self):
        self.assertAlmostEqual(self.calc.log(1), 0.0)

    def test_log_zero_raises(self):
        with self.assertRaises(CalculatorError):
            self.calc.log(0)

    def test_log_negative_raises(self):
        with self.assertRaises(CalculatorError):
            self.calc.log(-5)

    def test_log_invalid_base_raises(self):
        with self.assertRaises(CalculatorError):
            self.calc.log(10, 1)

    def test_log_negative_base_raises(self):
        with self.assertRaises(CalculatorError):
            self.calc.log(10, -2)


class TestCalculatorPercentage(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_percentage_basic(self):
        self.assertEqual(self.calc.percentage(200, 50), 100.0)

    def test_percentage_zero(self):
        self.assertEqual(self.calc.percentage(500, 0), 0.0)

    def test_percentage_100(self):
        self.assertEqual(self.calc.percentage(75, 100), 75.0)

    def test_percentage_float(self):
        self.assertAlmostEqual(self.calc.percentage(200, 33.5), 67.0)


class TestCalculatorMemory(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_memory_initial_zero(self):
        self.assertEqual(self.calc.memory_recall(), 0)

    def test_memory_store_and_recall(self):
        self.calc.memory_store(42)
        self.assertEqual(self.calc.memory_recall(), 42)

    def test_memory_clear(self):
        self.calc.memory_store(99)
        self.calc.memory_clear()
        self.assertEqual(self.calc.memory_recall(), 0)

    def test_memory_add(self):
        self.calc.memory_store(10)
        self.calc.memory_add(5)
        self.assertEqual(self.calc.memory_recall(), 15)

    def test_memory_subtract(self):
        self.calc.memory_store(10)
        self.calc.memory_subtract(3)
        self.assertEqual(self.calc.memory_recall(), 7)

    def test_memory_overwrite(self):
        self.calc.memory_store(1)
        self.calc.memory_store(2)
        self.assertEqual(self.calc.memory_recall(), 2)

    def test_memory_store_negative(self):
        self.calc.memory_store(-7.5)
        self.assertEqual(self.calc.memory_recall(), -7.5)

    def test_memory_add_cumulative(self):
        self.calc.memory_add(5)
        self.calc.memory_add(5)
        self.calc.memory_add(5)
        self.assertEqual(self.calc.memory_recall(), 15)


class TestCalculatorHistory(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_history_initially_empty(self):
        self.assertEqual(self.calc.get_history(), [])

    def test_history_records_operation(self):
        self.calc.add(1, 2)
        history = self.calc.get_history()
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]["operation"], "add")
        self.assertEqual(history[0]["operand_a"], 1)
        self.assertEqual(history[0]["operand_b"], 2)
        self.assertEqual(history[0]["result"], 3)

    def test_history_accumulates_multiple_operations(self):
        self.calc.add(1, 2)
        self.calc.subtract(5, 3)
        self.calc.multiply(4, 4)
        self.assertEqual(len(self.calc.get_history()), 3)

    def test_history_clear(self):
        self.calc.add(1, 2)
        self.calc.clear_history()
        self.assertEqual(self.calc.get_history(), [])

    def test_history_is_copy(self):
        self.calc.add(1, 2)
        history = self.calc.get_history()
        history.append({"operation": "fake"})
        self.assertEqual(len(self.calc.get_history()), 1)

    def test_history_single_operand_operations(self):
        self.calc.square_root(16)
        history = self.calc.get_history()
        self.assertEqual(history[0]["operand_b"], None)
        self.assertEqual(history[0]["result"], 4.0)

    def test_history_failed_operations_not_recorded(self):
        with self.assertRaises(DivisionByZeroError):
            self.calc.divide(1, 0)
        self.assertEqual(self.calc.get_history(), [])

    def test_history_operations_in_order(self):
        ops = ["add", "subtract", "multiply", "divide"]
        self.calc.add(1, 1)
        self.calc.subtract(2, 1)
        self.calc.multiply(3, 2)
        self.calc.divide(6, 2)
        history = self.calc.get_history()
        for i, op in enumerate(ops):
            self.assertEqual(history[i]["operation"], op)


class TestCalculatorIndependentInstances(unittest.TestCase):
    """Ensure separate Calculator instances do not share state."""

    def test_independent_history(self):
        c1 = Calculator()
        c2 = Calculator()
        c1.add(1, 2)
        self.assertEqual(len(c1.get_history()), 1)
        self.assertEqual(len(c2.get_history()), 0)

    def test_independent_memory(self):
        c1 = Calculator()
        c2 = Calculator()
        c1.memory_store(100)
        self.assertEqual(c1.memory_recall(), 100)
        self.assertEqual(c2.memory_recall(), 0)


class TestCalculatorExceptionHierarchy(unittest.TestCase):
    """Verify that custom exceptions are subclasses of CalculatorError."""

    def test_division_by_zero_is_calculator_error(self):
        self.assertTrue(issubclass(DivisionByZeroError, CalculatorError))

    def test_negative_sqrt_is_calculator_error(self):
        self.assertTrue(issubclass(NegativeSquareRootError, CalculatorError))

    def test_division_by_zero_caught_as_calculator_error(self):
        calc = Calculator()
        with self.assertRaises(CalculatorError):
            calc.divide(1, 0)

    def test_negative_sqrt_caught_as_calculator_error(self):
        calc = Calculator()
        with self.assertRaises(CalculatorError):
            calc.square_root(-1)


class TestCalculatorChainedOperations(unittest.TestCase):
    """Integration-style tests using the result of one operation as input to the next."""

    def setUp(self):
        self.calc = Calculator()

    def test_chain_add_then_multiply(self):
        result = self.calc.add(3, 7)      # 10
        result = self.calc.multiply(result, 5)  # 50
        self.assertEqual(result, 50)

    def test_chain_power_then_sqrt(self):
        result = self.calc.power(3, 2)        # 9
        result = self.calc.square_root(result)  # 3.0
        self.assertAlmostEqual(result, 3.0)

    def test_chain_with_memory(self):
        result = self.calc.add(10, 5)   # 15
        self.calc.memory_store(result)
        result2 = self.calc.multiply(self.calc.memory_recall(), 2)  # 30
        self.assertEqual(result2, 30)

    def test_history_length_after_chain(self):
        self.calc.add(1, 2)
        self.calc.multiply(3, 4)
        self.calc.subtract(10, 5)
        self.assertEqual(len(self.calc.get_history()), 3)


if __name__ == "__main__":
    unittest.main()
