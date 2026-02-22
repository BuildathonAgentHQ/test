import pytest
from calc import add, subtract, multiply


# --- add ---

class TestAdd:
    def test_positive_integers(self):
        assert add(1, 2, 3) == 6

    def test_zeros(self):
        assert add(0, 0, 0) == 0

    def test_negative_integers(self):
        assert add(-1, -2, -3) == -6

    def test_mixed_signs(self):
        assert add(-1, 2, -3) == -2

    def test_floats(self):
        assert add(1.5, 2.5, 3.0) == pytest.approx(7.0)

    def test_large_numbers(self):
        assert add(1_000_000, 2_000_000, 3_000_000) == 6_000_000

    def test_identity_with_zeros(self):
        assert add(5, 0, 0) == 5


# --- subtract ---

class TestSubtract:
    def test_positive_integers(self):
        assert subtract(10, 3, 2) == 5

    def test_result_zero(self):
        assert subtract(6, 3, 3) == 0

    def test_all_zeros(self):
        assert subtract(0, 0, 0) == 0

    def test_negative_result(self):
        assert subtract(1, 5, 3) == -7

    def test_negative_inputs(self):
        # a - (-b) - (-c) = a + b + c
        assert subtract(-1, -2, -3) == 4

    def test_floats(self):
        assert subtract(10.5, 2.5, 3.0) == pytest.approx(5.0)

    def test_large_numbers(self):
        assert subtract(10_000_000, 3_000_000, 2_000_000) == 5_000_000


# --- multiply ---

class TestMultiply:
    def test_positive_integers(self):
        assert multiply(2, 3, 4) == 24

    def test_with_zero(self):
        assert multiply(5, 0, 7) == 0

    def test_all_zeros(self):
        assert multiply(0, 0, 0) == 0

    def test_identity(self):
        assert multiply(7, 1, 1) == 7

    def test_negative_even_count(self):
        # two negatives → positive result
        assert multiply(-2, -3, 4) == 24

    def test_negative_odd_count(self):
        # three negatives → negative result
        assert multiply(-2, -3, -4) == -24

    def test_floats(self):
        assert multiply(1.5, 2.0, 4.0) == pytest.approx(12.0)

    def test_large_numbers(self):
        assert multiply(100, 200, 300) == 6_000_000
