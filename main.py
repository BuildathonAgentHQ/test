"""
Enhanced Dashboard - Python utility module.
Provides data-processing helpers that mirror the JS utility functions.
"""

from datetime import datetime, timezone


def calculate_stats(history):
    """Calculate statistics from a list of counter history entries.

    Each entry is a dict with at least a ``result_value`` key.
    Returns a dict with max, min, avg, and total.
    """
    if not history:
        return {"max": 0, "min": 0, "avg": 0, "total": 0}

    values = [h["result_value"] for h in history]
    total = len(values)
    avg = round(sum(values) / total, 2)

    return {
        "max": max(values),
        "min": min(values),
        "avg": avg,
        "total": total,
    }


def generate_report_data(history):
    """Return stats augmented with a generation timestamp and history count."""
    stats = calculate_stats(history)
    return {
        **stats,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "history_count": len(history),
    }


def validate_todo(todo):
    """Return True if *todo* is a non-empty string no longer than 200 chars."""
    if not isinstance(todo, str):
        return False
    stripped = todo.strip()
    return 0 < len(stripped) <= 200


def sort_todos(todos, sort_by="date-desc"):
    """Sort a list of todo dicts by the given criterion.

    Supported values for *sort_by*:
        ``"date-asc"``   – oldest first (ascending ``created_at``)
        ``"date-desc"``  – newest first (descending ``created_at``)
        ``"completed"``  – incomplete first, then completed
        ``"pending"``    – completed first, then incomplete
    """
    key_map = {
        "date-asc": lambda t: t.get("created_at", 0),
        "date-desc": lambda t: -t.get("created_at", 0),
        "completed": lambda t: (1 if t.get("completed") else 0),
        "pending": lambda t: (0 if t.get("completed") else 1),
    }
    key_fn = key_map.get(sort_by)
    if key_fn is None:
        return list(todos)
    return sorted(todos, key=key_fn)


def get_app_version():
    """Return the current application version string."""
    return "3.0.0"


def get_app_analytics(state):
    """Return a summary analytics dict derived from application *state*.

    *state* is expected to have ``history``, ``todos``, ``count``, and
    ``theme`` keys.
    """
    todos = state.get("todos", [])
    return {
        "total_counter_changes": len(state.get("history", [])),
        "total_todos": len(todos),
        "completed_todos": sum(1 for t in todos if t.get("completed")),
        "pending_todos": sum(1 for t in todos if not t.get("completed")),
        "current_count": state.get("count", 0),
        "current_theme": state.get("theme", "light"),
    }
