"""Unit tests for main.py"""

import unittest
from datetime import datetime

from main import (
    calculate_stats,
    generate_report_data,
    get_app_analytics,
    get_app_version,
    sort_todos,
    validate_todo,
)


# ---------------------------------------------------------------------------
# calculate_stats
# ---------------------------------------------------------------------------

class TestCalculateStats(unittest.TestCase):

    def test_empty_history_returns_zeros(self):
        result = calculate_stats([])
        self.assertEqual(result, {"max": 0, "min": 0, "avg": 0, "total": 0})

    def test_single_entry(self):
        result = calculate_stats([{"result_value": 5}])
        self.assertEqual(result["max"], 5)
        self.assertEqual(result["min"], 5)
        self.assertEqual(result["avg"], 5.0)
        self.assertEqual(result["total"], 1)

    def test_multiple_entries(self):
        history = [
            {"result_value": 10},
            {"result_value": 2},
            {"result_value": 6},
        ]
        result = calculate_stats(history)
        self.assertEqual(result["max"], 10)
        self.assertEqual(result["min"], 2)
        self.assertAlmostEqual(result["avg"], 6.0)
        self.assertEqual(result["total"], 3)

    def test_avg_is_rounded_to_two_decimal_places(self):
        history = [{"result_value": v} for v in [1, 2, 3]]
        result = calculate_stats(history)
        self.assertEqual(result["avg"], 2.0)

    def test_negative_values(self):
        history = [{"result_value": -5}, {"result_value": -1}]
        result = calculate_stats(history)
        self.assertEqual(result["max"], -1)
        self.assertEqual(result["min"], -5)

    def test_mixed_positive_negative(self):
        history = [{"result_value": -3}, {"result_value": 0}, {"result_value": 9}]
        result = calculate_stats(history)
        self.assertEqual(result["max"], 9)
        self.assertEqual(result["min"], -3)
        self.assertAlmostEqual(result["avg"], 2.0)


# ---------------------------------------------------------------------------
# generate_report_data
# ---------------------------------------------------------------------------

class TestGenerateReportData(unittest.TestCase):

    def test_empty_history(self):
        report = generate_report_data([])
        self.assertEqual(report["total"], 0)
        self.assertEqual(report["history_count"], 0)
        self.assertIn("generated_at", report)

    def test_contains_stats_and_metadata(self):
        history = [{"result_value": 4}, {"result_value": 8}]
        report = generate_report_data(history)
        self.assertEqual(report["max"], 8)
        self.assertEqual(report["min"], 4)
        self.assertEqual(report["history_count"], 2)
        self.assertIn("generated_at", report)

    def test_generated_at_is_iso_string(self):
        report = generate_report_data([])
        # Should not raise
        datetime.fromisoformat(report["generated_at"])


# ---------------------------------------------------------------------------
# validate_todo
# ---------------------------------------------------------------------------

class TestValidateTodo(unittest.TestCase):

    def test_valid_todo(self):
        self.assertTrue(validate_todo("Buy milk"))

    def test_empty_string_is_invalid(self):
        self.assertFalse(validate_todo(""))

    def test_whitespace_only_is_invalid(self):
        self.assertFalse(validate_todo("   "))

    def test_exactly_200_chars_is_valid(self):
        self.assertTrue(validate_todo("a" * 200))

    def test_201_chars_is_invalid(self):
        self.assertFalse(validate_todo("a" * 201))

    def test_non_string_is_invalid(self):
        self.assertFalse(validate_todo(None))
        self.assertFalse(validate_todo(123))
        self.assertFalse(validate_todo([]))

    def test_whitespace_trimmed_before_length_check(self):
        # "  a  " → stripped is "a" (length 1) → valid
        self.assertTrue(validate_todo("  a  "))


# ---------------------------------------------------------------------------
# sort_todos
# ---------------------------------------------------------------------------

class TestSortTodos(unittest.TestCase):

    def _make_todos(self):
        return [
            {"id": 1, "created_at": 100, "completed": False},
            {"id": 2, "created_at": 200, "completed": True},
            {"id": 3, "created_at": 50,  "completed": False},
        ]

    def test_sort_date_asc(self):
        todos = self._make_todos()
        result = sort_todos(todos, "date-asc")
        timestamps = [t["created_at"] for t in result]
        self.assertEqual(timestamps, sorted(timestamps))

    def test_sort_date_desc(self):
        todos = self._make_todos()
        result = sort_todos(todos, "date-desc")
        timestamps = [t["created_at"] for t in result]
        self.assertEqual(timestamps, sorted(timestamps, reverse=True))

    def test_sort_completed_puts_incomplete_first(self):
        todos = self._make_todos()
        result = sort_todos(todos, "completed")
        # Incomplete todos (completed=False) should come before completed ones
        self.assertFalse(result[0]["completed"])
        self.assertFalse(result[1]["completed"])
        self.assertTrue(result[2]["completed"])

    def test_sort_pending_puts_completed_first(self):
        todos = self._make_todos()
        result = sort_todos(todos, "pending")
        self.assertTrue(result[0]["completed"])

    def test_unknown_sort_returns_original_order(self):
        todos = self._make_todos()
        result = sort_todos(todos, "unknown")
        self.assertEqual([t["id"] for t in result], [t["id"] for t in todos])

    def test_does_not_mutate_original_list(self):
        todos = self._make_todos()
        original_ids = [t["id"] for t in todos]
        sort_todos(todos, "date-asc")
        self.assertEqual([t["id"] for t in todos], original_ids)

    def test_empty_list(self):
        self.assertEqual(sort_todos([], "date-asc"), [])

    def test_default_sort_is_date_desc(self):
        todos = self._make_todos()
        default_result = sort_todos(todos)
        explicit_result = sort_todos(todos, "date-desc")
        self.assertEqual(
            [t["id"] for t in default_result],
            [t["id"] for t in explicit_result],
        )


# ---------------------------------------------------------------------------
# get_app_version
# ---------------------------------------------------------------------------

class TestGetAppVersion(unittest.TestCase):

    def test_returns_string(self):
        self.assertIsInstance(get_app_version(), str)

    def test_version_format(self):
        version = get_app_version()
        parts = version.split(".")
        self.assertEqual(len(parts), 3)
        for part in parts:
            self.assertTrue(part.isdigit(), f"Expected digit segment, got: {part!r}")


# ---------------------------------------------------------------------------
# get_app_analytics
# ---------------------------------------------------------------------------

class TestGetAppAnalytics(unittest.TestCase):

    def _make_state(self):
        return {
            "count": 42,
            "theme": "dark",
            "history": [{"result_value": 1}, {"result_value": 2}],
            "todos": [
                {"id": 1, "completed": True},
                {"id": 2, "completed": False},
                {"id": 3, "completed": False},
            ],
        }

    def test_counter_changes(self):
        state = self._make_state()
        result = get_app_analytics(state)
        self.assertEqual(result["total_counter_changes"], 2)

    def test_total_todos(self):
        state = self._make_state()
        result = get_app_analytics(state)
        self.assertEqual(result["total_todos"], 3)

    def test_completed_and_pending_todos(self):
        state = self._make_state()
        result = get_app_analytics(state)
        self.assertEqual(result["completed_todos"], 1)
        self.assertEqual(result["pending_todos"], 2)

    def test_current_count_and_theme(self):
        state = self._make_state()
        result = get_app_analytics(state)
        self.assertEqual(result["current_count"], 42)
        self.assertEqual(result["current_theme"], "dark")

    def test_empty_state(self):
        result = get_app_analytics({})
        self.assertEqual(result["total_counter_changes"], 0)
        self.assertEqual(result["total_todos"], 0)
        self.assertEqual(result["completed_todos"], 0)
        self.assertEqual(result["pending_todos"], 0)
        self.assertEqual(result["current_count"], 0)
        self.assertEqual(result["current_theme"], "light")


if __name__ == "__main__":
    unittest.main()
