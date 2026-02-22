"""
arya.py - Core data management utilities for the React Counter app backend.

Provides Counter, TodoList, and HistoryTracker classes that mirror the
application logic in the frontend, suitable for server-side validation,
testing, and data processing.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List, Optional


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Counter
# ---------------------------------------------------------------------------

class Counter:
    """A simple counter with optional min/max bounds and step support."""

    def __init__(
        self,
        initial: int = 0,
        step: int = 1,
        min_value: Optional[int] = None,
        max_value: Optional[int] = None,
    ) -> None:
        if step <= 0:
            raise ValueError(f"step must be a positive integer, got {step}")
        if min_value is not None and max_value is not None and min_value > max_value:
            raise ValueError(
                f"min_value ({min_value}) must be <= max_value ({max_value})"
            )
        if min_value is not None and initial < min_value:
            raise ValueError(
                f"initial ({initial}) is below min_value ({min_value})"
            )
        if max_value is not None and initial > max_value:
            raise ValueError(
                f"initial ({initial}) is above max_value ({max_value})"
            )

        self._value = initial
        self._step = step
        self._min = min_value
        self._max = max_value

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def value(self) -> int:
        return self._value

    @property
    def step(self) -> int:
        return self._step

    @property
    def min_value(self) -> Optional[int]:
        return self._min

    @property
    def max_value(self) -> Optional[int]:
        return self._max

    # ------------------------------------------------------------------
    # Mutators
    # ------------------------------------------------------------------

    def increment(self) -> int:
        """Increment by step. Clamps to max_value if set. Returns new value."""
        new = self._value + self._step
        if self._max is not None:
            new = min(new, self._max)
        self._value = new
        return self._value

    def decrement(self) -> int:
        """Decrement by step. Clamps to min_value if set. Returns new value."""
        new = self._value - self._step
        if self._min is not None:
            new = max(new, self._min)
        self._value = new
        return self._value

    def reset(self, value: int = 0) -> int:
        """Reset to *value* (defaults to 0). Validates against bounds."""
        if self._min is not None and value < self._min:
            raise ValueError(
                f"reset value ({value}) is below min_value ({self._min})"
            )
        if self._max is not None and value > self._max:
            raise ValueError(
                f"reset value ({value}) is above max_value ({self._max})"
            )
        self._value = value
        return self._value

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"Counter(value={self._value}, step={self._step}, "
            f"min={self._min}, max={self._max})"
        )


# ---------------------------------------------------------------------------
# TodoItem / TodoList
# ---------------------------------------------------------------------------

@dataclass
class TodoItem:
    """Represents a single todo entry."""

    id: int
    text: str
    completed: bool = False
    created_at: datetime = field(default_factory=_now)

    def toggle(self) -> "TodoItem":
        """Flip the completed flag in place and return self."""
        self.completed = not self.completed
        return self


class TodoList:
    """Manages a collection of :class:`TodoItem` objects."""

    def __init__(self) -> None:
        self._items: List[TodoItem] = []
        self._next_id: int = 1

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    @property
    def items(self) -> List[TodoItem]:
        return list(self._items)

    @property
    def count(self) -> int:
        return len(self._items)

    @property
    def completed_count(self) -> int:
        return sum(1 for item in self._items if item.completed)

    @property
    def pending_count(self) -> int:
        return self.count - self.completed_count

    def get(self, todo_id: int) -> Optional[TodoItem]:
        """Return the :class:`TodoItem` with the given id, or ``None``."""
        for item in self._items:
            if item.id == todo_id:
                return item
        return None

    # ------------------------------------------------------------------
    # Mutators
    # ------------------------------------------------------------------

    def add(self, text: str) -> TodoItem:
        """Add a new todo. Returns the created :class:`TodoItem`."""
        text = text.strip()
        if not text:
            raise ValueError("Todo text must not be empty")
        item = TodoItem(id=self._next_id, text=text)
        self._next_id += 1
        self._items.append(item)
        return item

    def toggle(self, todo_id: int) -> TodoItem:
        """Toggle completion state. Raises ``KeyError`` if not found."""
        item = self.get(todo_id)
        if item is None:
            raise KeyError(f"Todo with id {todo_id} not found")
        item.toggle()
        return item

    def delete(self, todo_id: int) -> TodoItem:
        """Delete and return the todo. Raises ``KeyError`` if not found."""
        for i, item in enumerate(self._items):
            if item.id == todo_id:
                return self._items.pop(i)
        raise KeyError(f"Todo with id {todo_id} not found")

    def clear_completed(self) -> int:
        """Remove all completed todos. Returns the number removed."""
        before = len(self._items)
        self._items = [item for item in self._items if not item.completed]
        return before - len(self._items)

    def __repr__(self) -> str:  # pragma: no cover
        return f"TodoList(count={self.count}, completed={self.completed_count})"


# ---------------------------------------------------------------------------
# HistoryTracker
# ---------------------------------------------------------------------------

@dataclass
class HistoryEntry:
    """A single recorded event."""

    action: str
    value: object = None
    timestamp: datetime = field(default_factory=_now)


class HistoryTracker:
    """Records a sequence of named actions and their associated values."""

    def __init__(self, max_entries: Optional[int] = None) -> None:
        if max_entries is not None and max_entries <= 0:
            raise ValueError(
                f"max_entries must be a positive integer, got {max_entries}"
            )
        self._entries: List[HistoryEntry] = []
        self._max = max_entries

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    @property
    def entries(self) -> List[HistoryEntry]:
        return list(self._entries)

    @property
    def count(self) -> int:
        return len(self._entries)

    def latest(self) -> Optional[HistoryEntry]:
        """Return the most recent entry, or ``None`` if empty."""
        return self._entries[-1] if self._entries else None

    def filter_by_action(self, action: str) -> List[HistoryEntry]:
        """Return all entries whose action matches *action*."""
        return [e for e in self._entries if e.action == action]

    def action_counts(self) -> dict:
        """Return a mapping of action -> occurrence count."""
        counts: dict = {}
        for entry in self._entries:
            counts[entry.action] = counts.get(entry.action, 0) + 1
        return counts

    # ------------------------------------------------------------------
    # Mutators
    # ------------------------------------------------------------------

    def record(self, action: str, value: object = None) -> HistoryEntry:
        """Append a new entry. Evicts the oldest when *max_entries* is reached."""
        action = action.strip()
        if not action:
            raise ValueError("action must not be empty")
        entry = HistoryEntry(action=action, value=value)
        if self._max is not None and len(self._entries) >= self._max:
            self._entries.pop(0)
        self._entries.append(entry)
        return entry

    def clear(self) -> int:
        """Clear all entries. Returns the number removed."""
        removed = len(self._entries)
        self._entries.clear()
        return removed

    def __repr__(self) -> str:  # pragma: no cover
        return f"HistoryTracker(count={self.count}, max={self._max})"
