import unittest
from calculator import add, subtract, multiply, divide


class TestAdd(unittest.TestCase):
    def test_add_two_positive_numbers(self):
        self.assertEqual(add(2, 3), 5)

    def test_add_two_negative_numbers(self):
        self.assertEqual(add(-4, -6), -10)

    def test_add_positive_and_negative(self):
        self.assertEqual(add(10, -3), 7)

    def test_add_with_zero(self):
        self.assertEqual(add(0, 5), 5)
        self.assertEqual(add(5, 0), 5)

    def test_add_floats(self):
        self.assertAlmostEqual(add(1.1, 2.2), 3.3)

    def test_add_large_numbers(self):
        self.assertEqual(add(10**9, 10**9), 2 * 10**9)


class TestSubtract(unittest.TestCase):
    def test_subtract_two_positive_numbers(self):
        self.assertEqual(subtract(10, 4), 6)

    def test_subtract_resulting_in_negative(self):
        self.assertEqual(subtract(3, 7), -4)

    def test_subtract_two_negative_numbers(self):
        self.assertEqual(subtract(-5, -3), -2)

    def test_subtract_with_zero(self):
        self.assertEqual(subtract(0, 5), -5)
        self.assertEqual(subtract(5, 0), 5)

    def test_subtract_floats(self):
        self.assertAlmostEqual(subtract(5.5, 2.2), 3.3)

    def test_subtract_same_numbers(self):
        self.assertEqual(subtract(7, 7), 0)


class TestMultiply(unittest.TestCase):
    def test_multiply_two_positive_numbers(self):
        self.assertEqual(multiply(3, 4), 12)

    def test_multiply_two_negative_numbers(self):
        self.assertEqual(multiply(-3, -4), 12)

    def test_multiply_positive_and_negative(self):
        self.assertEqual(multiply(3, -4), -12)

    def test_multiply_by_zero(self):
        self.assertEqual(multiply(5, 0), 0)
        self.assertEqual(multiply(0, 5), 0)

    def test_multiply_by_one(self):
        self.assertEqual(multiply(7, 1), 7)

    def test_multiply_floats(self):
        self.assertAlmostEqual(multiply(2.5, 4.0), 10.0)


class TestDivide(unittest.TestCase):
    def test_divide_two_positive_numbers(self):
        self.assertEqual(divide(10, 2), 5.0)

    def test_divide_two_negative_numbers(self):
        self.assertEqual(divide(-10, -2), 5.0)

    def test_divide_positive_by_negative(self):
        self.assertEqual(divide(10, -2), -5.0)

    def test_divide_resulting_in_fraction(self):
        self.assertAlmostEqual(divide(1, 3), 0.3333333333333333)

    def test_divide_floats(self):
        self.assertAlmostEqual(divide(7.5, 2.5), 3.0)

    def test_divide_by_zero_raises_value_error(self):
        with self.assertRaises(ValueError) as ctx:
            divide(5, 0)
        self.assertEqual(str(ctx.exception), "Cannot divide by zero")

    def test_divide_zero_by_nonzero(self):
        self.assertEqual(divide(0, 5), 0.0)


if __name__ == "__main__":
    unittest.main()
