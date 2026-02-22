"""
test_arya.py - Comprehensive tests for arya.py

Run with:
    python -m pytest test_arya.py -v
or:
    python -m pytest test_arya.py -v --tb=short
"""

import pytest
from arya import Counter, TodoItem, TodoList, HistoryEntry, HistoryTracker


# ===========================================================================
# Counter tests
# ===========================================================================

class TestCounterInit:
    def test_default_initial_value(self):
        c = Counter()
        assert c.value == 0

    def test_custom_initial_value(self):
        c = Counter(initial=10)
        assert c.value == 10

    def test_custom_step(self):
        c = Counter(step=5)
        assert c.step == 5

    def test_negative_initial_allowed_without_bounds(self):
        c = Counter(initial=-5)
        assert c.value == -5

    def test_step_zero_raises(self):
        with pytest.raises(ValueError, match="step must be a positive integer"):
            Counter(step=0)

    def test_step_negative_raises(self):
        with pytest.raises(ValueError, match="step must be a positive integer"):
            Counter(step=-1)

    def test_min_greater_than_max_raises(self):
        with pytest.raises(ValueError, match="min_value.*must be.*max_value"):
            Counter(min_value=10, max_value=5)

    def test_initial_below_min_raises(self):
        with pytest.raises(ValueError, match="initial.*is below min_value"):
            Counter(initial=1, min_value=5)

    def test_initial_above_max_raises(self):
        with pytest.raises(ValueError, match="initial.*is above max_value"):
            Counter(initial=100, max_value=50)

    def test_min_equals_max_allowed(self):
        c = Counter(initial=5, min_value=5, max_value=5)
        assert c.value == 5


class TestCounterIncrement:
    def test_basic_increment(self):
        c = Counter()
        assert c.increment() == 1
        assert c.value == 1

    def test_increment_with_step(self):
        c = Counter(step=3)
        c.increment()
        assert c.value == 3

    def test_multiple_increments(self):
        c = Counter()
        for i in range(5):
            c.increment()
        assert c.value == 5

    def test_increment_respects_max(self):
        c = Counter(initial=9, step=5, max_value=10)
        c.increment()
        assert c.value == 10  # clamped, not 14

    def test_increment_at_max_stays(self):
        c = Counter(initial=10, max_value=10)
        c.increment()
        assert c.value == 10

    def test_increment_without_max_unbounded(self):
        c = Counter(initial=1_000_000)
        c.increment()
        assert c.value == 1_000_001


class TestCounterDecrement:
    def test_basic_decrement(self):
        c = Counter(initial=5)
        assert c.decrement() == 4
        assert c.value == 4

    def test_decrement_with_step(self):
        c = Counter(initial=10, step=3)
        c.decrement()
        assert c.value == 7

    def test_decrement_respects_min(self):
        c = Counter(initial=2, step=5, min_value=0)
        c.decrement()
        assert c.value == 0  # clamped, not -3

    def test_decrement_at_min_stays(self):
        c = Counter(initial=0, min_value=0)
        c.decrement()
        assert c.value == 0

    def test_decrement_without_min_goes_negative(self):
        c = Counter()
        c.decrement()
        assert c.value == -1

    def test_multiple_decrements(self):
        c = Counter(initial=10)
        for _ in range(10):
            c.decrement()
        assert c.value == 0


class TestCounterReset:
    def test_reset_to_zero(self):
        c = Counter(initial=42)
        c.reset()
        assert c.value == 0

    def test_reset_to_custom_value(self):
        c = Counter()
        c.reset(7)
        assert c.value == 7

    def test_reset_below_min_raises(self):
        c = Counter(initial=5, min_value=5)
        with pytest.raises(ValueError, match="reset value.*is below min_value"):
            c.reset(4)

    def test_reset_above_max_raises(self):
        c = Counter(initial=5, max_value=10)
        with pytest.raises(ValueError, match="reset value.*is above max_value"):
            c.reset(11)

    def test_reset_to_min_allowed(self):
        c = Counter(initial=10, min_value=0)
        c.reset(0)
        assert c.value == 0

    def test_reset_to_max_allowed(self):
        c = Counter(initial=0, max_value=10)
        c.reset(10)
        assert c.value == 10


class TestCounterProperties:
    def test_min_value_property(self):
        c = Counter(min_value=-10)
        assert c.min_value == -10

    def test_max_value_property(self):
        c = Counter(max_value=100)
        assert c.max_value == 100

    def test_no_bounds_returns_none(self):
        c = Counter()
        assert c.min_value is None
        assert c.max_value is None


# ===========================================================================
# TodoItem tests
# ===========================================================================

class TestTodoItem:
    def test_creation_defaults(self):
        item = TodoItem(id=1, text="Buy milk")
        assert item.id == 1
        assert item.text == "Buy milk"
        assert item.completed is False
        assert item.created_at is not None

    def test_toggle_completes(self):
        item = TodoItem(id=1, text="Task")
        item.toggle()
        assert item.completed is True

    def test_toggle_twice_returns_to_false(self):
        item = TodoItem(id=1, text="Task")
        item.toggle()
        item.toggle()
        assert item.completed is False

    def test_toggle_returns_self(self):
        item = TodoItem(id=1, text="Task")
        result = item.toggle()
        assert result is item


# ===========================================================================
# TodoList tests
# ===========================================================================

class TestTodoListAdd:
    def test_add_single_item(self):
        tl = TodoList()
        item = tl.add("First task")
        assert item.text == "First task"
        assert item.id == 1
        assert tl.count == 1

    def test_add_multiple_items_increments_id(self):
        tl = TodoList()
        a = tl.add("Task A")
        b = tl.add("Task B")
        assert a.id == 1
        assert b.id == 2

    def test_add_strips_whitespace(self):
        tl = TodoList()
        item = tl.add("  hello  ")
        assert item.text == "hello"

    def test_add_empty_raises(self):
        tl = TodoList()
        with pytest.raises(ValueError, match="must not be empty"):
            tl.add("")

    def test_add_whitespace_only_raises(self):
        tl = TodoList()
        with pytest.raises(ValueError, match="must not be empty"):
            tl.add("   ")


class TestTodoListQueries:
    def setup_method(self):
        self.tl = TodoList()
        self.tl.add("Task 1")
        self.tl.add("Task 2")
        self.tl.add("Task 3")

    def test_count(self):
        assert self.tl.count == 3

    def test_items_returns_copy(self):
        items = self.tl.items
        items.clear()
        assert self.tl.count == 3  # original unaffected

    def test_completed_count_zero_by_default(self):
        assert self.tl.completed_count == 0

    def test_pending_count_equals_total_by_default(self):
        assert self.tl.pending_count == 3

    def test_completed_and_pending_after_toggle(self):
        self.tl.toggle(1)
        assert self.tl.completed_count == 1
        assert self.tl.pending_count == 2

    def test_get_existing(self):
        item = self.tl.get(2)
        assert item is not None
        assert item.text == "Task 2"

    def test_get_nonexistent_returns_none(self):
        assert self.tl.get(999) is None

    def test_empty_list_counts(self):
        tl = TodoList()
        assert tl.count == 0
        assert tl.completed_count == 0
        assert tl.pending_count == 0


class TestTodoListToggle:
    def test_toggle_marks_completed(self):
        tl = TodoList()
        tl.add("Task")
        tl.toggle(1)
        assert tl.get(1).completed is True

    def test_toggle_idempotent_twice(self):
        tl = TodoList()
        tl.add("Task")
        tl.toggle(1)
        tl.toggle(1)
        assert tl.get(1).completed is False

    def test_toggle_nonexistent_raises(self):
        tl = TodoList()
        with pytest.raises(KeyError, match="999"):
            tl.toggle(999)

    def test_toggle_returns_item(self):
        tl = TodoList()
        tl.add("Task")
        item = tl.toggle(1)
        assert item.id == 1


class TestTodoListDelete:
    def test_delete_existing(self):
        tl = TodoList()
        tl.add("Task")
        deleted = tl.delete(1)
        assert deleted.id == 1
        assert tl.count == 0

    def test_delete_reduces_count(self):
        tl = TodoList()
        tl.add("A")
        tl.add("B")
        tl.delete(1)
        assert tl.count == 1

    def test_delete_nonexistent_raises(self):
        tl = TodoList()
        with pytest.raises(KeyError, match="42"):
            tl.delete(42)

    def test_delete_middle_item(self):
        tl = TodoList()
        tl.add("A")
        tl.add("B")
        tl.add("C")
        tl.delete(2)
        ids = [item.id for item in tl.items]
        assert ids == [1, 3]


class TestTodoListClearCompleted:
    def test_clear_completed_removes_done(self):
        tl = TodoList()
        tl.add("A")
        tl.add("B")
        tl.add("C")
        tl.toggle(1)
        tl.toggle(3)
        removed = tl.clear_completed()
        assert removed == 2
        assert tl.count == 1
        assert tl.get(2) is not None

    def test_clear_completed_no_completed_removes_nothing(self):
        tl = TodoList()
        tl.add("A")
        removed = tl.clear_completed()
        assert removed == 0
        assert tl.count == 1

    def test_clear_all_completed(self):
        tl = TodoList()
        tl.add("A")
        tl.add("B")
        tl.toggle(1)
        tl.toggle(2)
        tl.clear_completed()
        assert tl.count == 0


# ===========================================================================
# HistoryEntry tests
# ===========================================================================

class TestHistoryEntry:
    def test_creation(self):
        entry = HistoryEntry(action="increment", value=1)
        assert entry.action == "increment"
        assert entry.value == 1
        assert entry.timestamp is not None

    def test_none_value_allowed(self):
        entry = HistoryEntry(action="reset")
        assert entry.value is None


# ===========================================================================
# HistoryTracker tests
# ===========================================================================

class TestHistoryTrackerInit:
    def test_default_unlimited(self):
        ht = HistoryTracker()
        assert ht.count == 0
        assert ht._max is None

    def test_max_entries_set(self):
        ht = HistoryTracker(max_entries=5)
        assert ht._max == 5

    def test_max_entries_zero_raises(self):
        with pytest.raises(ValueError, match="max_entries must be a positive integer"):
            HistoryTracker(max_entries=0)

    def test_max_entries_negative_raises(self):
        with pytest.raises(ValueError, match="max_entries must be a positive integer"):
            HistoryTracker(max_entries=-1)


class TestHistoryTrackerRecord:
    def test_record_adds_entry(self):
        ht = HistoryTracker()
        entry = ht.record("increment", 1)
        assert ht.count == 1
        assert entry.action == "increment"
        assert entry.value == 1

    def test_record_empty_action_raises(self):
        ht = HistoryTracker()
        with pytest.raises(ValueError, match="action must not be empty"):
            ht.record("")

    def test_record_whitespace_only_action_raises(self):
        ht = HistoryTracker()
        with pytest.raises(ValueError, match="action must not be empty"):
            ht.record("   ")

    def test_record_strips_action_whitespace(self):
        ht = HistoryTracker()
        entry = ht.record("  click  ", 5)
        assert entry.action == "click"

    def test_record_multiple(self):
        ht = HistoryTracker()
        ht.record("a")
        ht.record("b")
        ht.record("c")
        assert ht.count == 3

    def test_record_evicts_oldest_when_full(self):
        ht = HistoryTracker(max_entries=3)
        ht.record("first", 1)
        ht.record("second", 2)
        ht.record("third", 3)
        ht.record("fourth", 4)  # should evict "first"
        assert ht.count == 3
        assert ht.entries[0].action == "second"
        assert ht.entries[-1].action == "fourth"

    def test_record_without_value(self):
        ht = HistoryTracker()
        entry = ht.record("reset")
        assert entry.value is None


class TestHistoryTrackerQueries:
    def setup_method(self):
        self.ht = HistoryTracker()
        self.ht.record("increment", 1)
        self.ht.record("increment", 2)
        self.ht.record("decrement", 1)
        self.ht.record("reset", 0)

    def test_entries_returns_copy(self):
        entries = self.ht.entries
        entries.clear()
        assert self.ht.count == 4  # original unaffected

    def test_latest_returns_last(self):
        latest = self.ht.latest()
        assert latest.action == "reset"

    def test_latest_on_empty_returns_none(self):
        assert HistoryTracker().latest() is None

    def test_filter_by_action(self):
        increments = self.ht.filter_by_action("increment")
        assert len(increments) == 2
        assert all(e.action == "increment" for e in increments)

    def test_filter_by_action_no_match(self):
        assert self.ht.filter_by_action("unknown") == []

    def test_action_counts(self):
        counts = self.ht.action_counts()
        assert counts == {"increment": 2, "decrement": 1, "reset": 1}

    def test_action_counts_empty(self):
        assert HistoryTracker().action_counts() == {}


class TestHistoryTrackerClear:
    def test_clear_removes_all(self):
        ht = HistoryTracker()
        ht.record("a")
        ht.record("b")
        removed = ht.clear()
        assert removed == 2
        assert ht.count == 0

    def test_clear_empty_returns_zero(self):
        ht = HistoryTracker()
        assert ht.clear() == 0

    def test_can_record_after_clear(self):
        ht = HistoryTracker()
        ht.record("a")
        ht.clear()
        ht.record("b")
        assert ht.count == 1
        assert ht.latest().action == "b"


# ===========================================================================
# Integration tests
# ===========================================================================

class TestIntegration:
    """End-to-end scenarios combining Counter + TodoList + HistoryTracker."""

    def test_counter_and_history_tracking(self):
        counter = Counter(initial=0, min_value=0, max_value=5)
        history = HistoryTracker()

        history.record("increment", counter.increment())
        history.record("increment", counter.increment())
        history.record("decrement", counter.decrement())

        assert counter.value == 1
        assert history.count == 3
        counts = history.action_counts()
        assert counts["increment"] == 2
        assert counts["decrement"] == 1

    def test_todo_workflow(self):
        tl = TodoList()
        history = HistoryTracker()

        a = tl.add("Buy groceries")
        history.record("add", a.id)

        b = tl.add("Write tests")
        history.record("add", b.id)

        tl.toggle(a.id)
        history.record("toggle", a.id)

        removed = tl.clear_completed()
        history.record("clear_completed", removed)

        assert tl.count == 1
        assert tl.get(a.id) is None
        assert history.count == 4

    def test_bounded_counter_stays_within_limits(self):
        c = Counter(initial=5, min_value=0, max_value=5)
        for _ in range(10):
            c.increment()
        assert c.value == 5
        for _ in range(10):
            c.decrement()
        assert c.value == 0

    def test_history_max_entries_rolling_window(self):
        ht = HistoryTracker(max_entries=2)
        ht.record("a")
        ht.record("b")
        ht.record("c")
        actions = [e.action for e in ht.entries]
        assert actions == ["b", "c"]
