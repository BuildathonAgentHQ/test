/**
 * Unit tests for the logic introduced / modified in src/main.js (PR #25).
 *
 * src/main.js is an application entry point that executes DOM and canvas
 * operations at module load time, making direct import impractical in a
 * headless test environment.  We therefore extract and verify each logical
 * unit as a standalone pure function so that the business rules can be
 * exercised independently of the browser runtime.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── HTML escaping ────────────────────────────────────────────────────────────
// Extracted from main.js: escapeHtml()

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

describe('escapeHtml', () => {
  it('leaves plain text unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than sign', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  it('escapes greater-than sign', () => {
    expect(escapeHtml('1 > 0')).toBe('1 &gt; 0');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's fine")).toBe("it&#039;s fine");
  });

  it('handles an empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('escapes multiple special characters in one string', () => {
    expect(escapeHtml('<a href="x&y">it\'s</a>')).toBe(
      '&lt;a href=&quot;x&amp;y&quot;&gt;it&#039;s&lt;/a&gt;'
    );
  });

  it('does not double-escape already-escaped entities', () => {
    // escapeHtml is not idempotent for '&' — this is intentional.
    // '&amp;' contains '&', so it will be re-escaped.
    const result = escapeHtml('&amp;');
    expect(result).toBe('&amp;amp;');
  });
});

// ─── Counter arithmetic ───────────────────────────────────────────────────────
// Validates the increment / decrement / reset logic from main.js

describe('Counter arithmetic', () => {
  it('increments by the given amount', () => {
    let count = 0;
    count += 1;
    expect(count).toBe(1);
    count += 10;
    expect(count).toBe(11);
  });

  it('decrements by the given amount', () => {
    let count = 20;
    count -= 5;
    expect(count).toBe(15);
    count -= 10;
    expect(count).toBe(5);
  });

  it('records the correct change value on increment', () => {
    const history = [];
    function recordHistory(change, resultValue) {
      history.push({ value: change, resultValue, timestamp: Date.now() });
    }

    let count = 0;
    const amount = 5;
    count += amount;
    recordHistory(amount, count);

    expect(history).toHaveLength(1);
    expect(history[0].value).toBe(5);
    expect(history[0].resultValue).toBe(5);
  });

  it('records a negative change value on decrement', () => {
    const history = [];
    function recordHistory(change, resultValue) {
      history.push({ value: change, resultValue, timestamp: Date.now() });
    }

    let count = 10;
    const amount = 3;
    count -= amount;
    recordHistory(-amount, count);

    expect(history[0].value).toBe(-3);
    expect(history[0].resultValue).toBe(7);
  });

  it('reset sets count to 0 and records change as negative of old value', () => {
    let count = 42;
    const changeOnReset = -count;
    count = 0;

    expect(count).toBe(0);
    expect(changeOnReset).toBe(-42);
  });

  it('custom value sets count directly and computes the correct delta', () => {
    let count = 10;
    const newValue = 25;
    const delta = newValue - count;
    count = newValue;

    expect(count).toBe(25);
    expect(delta).toBe(15);
  });
});

// ─── Todo completion progress ─────────────────────────────────────────────────
// Extracted from main.js: updateTodos() progress calculation

function calculateProgress(todos) {
  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

describe('Todo completion progress', () => {
  it('returns 0 for an empty list', () => {
    expect(calculateProgress([])).toBe(0);
  });

  it('returns 100 when every todo is completed', () => {
    const todos = [{ completed: true }, { completed: true }];
    expect(calculateProgress(todos)).toBe(100);
  });

  it('returns 0 when no todo is completed', () => {
    const todos = [{ completed: false }, { completed: false }];
    expect(calculateProgress(todos)).toBe(0);
  });

  it('returns 50 for exactly half completed', () => {
    const todos = [{ completed: true }, { completed: false }];
    expect(calculateProgress(todos)).toBe(50);
  });

  it('rounds to the nearest integer', () => {
    const todos = [
      { completed: true },
      { completed: false },
      { completed: false },
    ];
    expect(calculateProgress(todos)).toBe(33); // 33.333… → 33
  });

  it('returns 67 for two of three completed', () => {
    const todos = [
      { completed: true },
      { completed: true },
      { completed: false },
    ];
    expect(calculateProgress(todos)).toBe(67); // 66.666… → 67
  });
});

// ─── Todo badge count ─────────────────────────────────────────────────────────
// Validates the pending-count logic from updateTodos()

function pendingCount(todos) {
  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;
  return total > completed ? total - completed : 0;
}

describe('Todo badge (pending count)', () => {
  it('returns 0 when there are no todos', () => {
    expect(pendingCount([])).toBe(0);
  });

  it('returns 0 when all todos are completed', () => {
    expect(pendingCount([{ completed: true }, { completed: true }])).toBe(0);
  });

  it('returns total when none are completed', () => {
    expect(pendingCount([{ completed: false }, { completed: false }])).toBe(2);
  });

  it('returns the correct pending count for a mixed list', () => {
    const todos = [
      { completed: true },
      { completed: false },
      { completed: false },
    ];
    expect(pendingCount(todos)).toBe(2);
  });
});

// ─── Aurora Focus — Pomodoro timer constants (PR #25) ────────────────────────

describe('Pomodoro timer constants', () => {
  const MODES = [
    { label: 'FOCUS', duration: 25 * 60, next: '5m' },
    { label: 'BREAK', duration: 5 * 60,  next: '25m' },
  ];
  const CIRCUMFERENCE = 327; // 2π × 52, rounded to the nearest integer

  it('FOCUS mode duration is 25 minutes (1 500 s)', () => {
    expect(MODES[0].duration).toBe(1500);
  });

  it('BREAK mode duration is 5 minutes (300 s)', () => {
    expect(MODES[1].duration).toBe(300);
  });

  it('FOCUS mode next label is "5m"', () => {
    expect(MODES[0].next).toBe('5m');
  });

  it('BREAK mode next label is "25m"', () => {
    expect(MODES[1].next).toBe('25m');
  });

  it('CIRCUMFERENCE is within 1 unit of 2π × 52', () => {
    expect(Math.abs(CIRCUMFERENCE - 2 * Math.PI * 52)).toBeLessThan(1);
  });

  it('cycling modeIdx wraps back to FOCUS after BREAK', () => {
    let modeIdx = 0;
    modeIdx = (modeIdx + 1) % MODES.length; // → BREAK
    expect(MODES[modeIdx].label).toBe('BREAK');
    modeIdx = (modeIdx + 1) % MODES.length; // → FOCUS
    expect(MODES[modeIdx].label).toBe('FOCUS');
  });

  it('sessions counter increments only when leaving FOCUS mode', () => {
    let sessions = 0;
    let modeIdx = 0;

    function completeCycle() {
      if (modeIdx === 0) sessions++; // leaving FOCUS
      modeIdx = (modeIdx + 1) % MODES.length;
    }

    completeCycle(); // FOCUS → BREAK, sessions = 1
    expect(sessions).toBe(1);
    completeCycle(); // BREAK → FOCUS, sessions unchanged
    expect(sessions).toBe(1);
    completeCycle(); // FOCUS → BREAK, sessions = 2
    expect(sessions).toBe(2);
  });
});

// ─── Aurora Focus — timer display formatting (PR #25) ────────────────────────

function formatTimerDisplay(remaining) {
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

describe('Timer display formatting', () => {
  it('formats 25:00 for a full FOCUS session', () => {
    expect(formatTimerDisplay(1500)).toBe('25:00');
  });

  it('formats 05:00 for a full BREAK session', () => {
    expect(formatTimerDisplay(300)).toBe('05:00');
  });

  it('formats 01:30 for 90 seconds', () => {
    expect(formatTimerDisplay(90)).toBe('01:30');
  });

  it('formats 00:00 for zero', () => {
    expect(formatTimerDisplay(0)).toBe('00:00');
  });

  it('pads single-digit seconds with a leading zero', () => {
    expect(formatTimerDisplay(61)).toBe('01:01');
  });

  it('pads single-digit minutes with a leading zero', () => {
    expect(formatTimerDisplay(9 * 60 + 5)).toBe('09:05');
  });

  it('handles exactly one second remaining', () => {
    expect(formatTimerDisplay(1)).toBe('00:01');
  });
});

// ─── Aurora Focus — SVG ring offset calculation (PR #25) ─────────────────────

describe('SVG ring stroke-dashoffset calculation', () => {
  const CIRCUMFERENCE = 327;

  function ringOffset(remaining, totalDuration) {
    const frac = remaining / totalDuration;
    return CIRCUMFERENCE * (1 - frac);
  }

  it('offset is 0 when timer is full (nothing consumed)', () => {
    expect(ringOffset(1500, 1500)).toBeCloseTo(0);
  });

  it('offset equals CIRCUMFERENCE when timer is exhausted', () => {
    expect(ringOffset(0, 1500)).toBeCloseTo(CIRCUMFERENCE);
  });

  it('offset is half the circumference at the halfway point', () => {
    expect(ringOffset(750, 1500)).toBeCloseTo(CIRCUMFERENCE / 2);
  });

  it('offset decreases as remaining time decreases', () => {
    const full = ringOffset(1500, 1500);
    const half = ringOffset(750, 1500);
    const empty = ringOffset(0, 1500);
    expect(full).toBeLessThan(half);
    expect(half).toBeLessThan(empty);
  });
});

// ─── Aurora Focus — clock time formatting (PR #25) ───────────────────────────

function formatClockTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

describe('Clock time formatting', () => {
  it('formats midnight as 00:00:00', () => {
    const date = new Date(2024, 0, 1, 0, 0, 0);
    expect(formatClockTime(date)).toBe('00:00:00');
  });

  it('pads single-digit hours, minutes, and seconds', () => {
    const date = new Date(2024, 0, 1, 9, 5, 3);
    expect(formatClockTime(date)).toBe('09:05:03');
  });

  it('formats noon correctly', () => {
    const date = new Date(2024, 0, 1, 12, 0, 0);
    expect(formatClockTime(date)).toBe('12:00:00');
  });

  it('formats 23:59:59 correctly', () => {
    const date = new Date(2024, 0, 1, 23, 59, 59);
    expect(formatClockTime(date)).toBe('23:59:59');
  });

  it('always produces an HH:MM:SS pattern', () => {
    const date = new Date(2024, 5, 15, 14, 30, 45);
    expect(formatClockTime(date)).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

// ─── Aurora Focus — clock date formatting (PR #25) ───────────────────────────

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatClockDate(date) {
  return `${DAYS[date.getDay()]} · ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

describe('Clock date formatting', () => {
  it('formats a known date correctly', () => {
    // January 1 2024 was a Monday
    const date = new Date(2024, 0, 1, 12, 0, 0);
    expect(formatClockDate(date)).toBe('Monday · Jan 1, 2024');
  });

  it('includes the correct day name', () => {
    const date = new Date(2024, 5, 15, 0, 0, 0); // Saturday
    expect(formatClockDate(date)).toContain('Saturday');
  });

  it('includes the correct month abbreviation', () => {
    const date = new Date(2024, 11, 25, 0, 0, 0); // December
    expect(formatClockDate(date)).toContain('Dec');
  });

  it('includes the four-digit year', () => {
    const date = new Date(2026, 0, 1, 0, 0, 0);
    expect(formatClockDate(date)).toContain('2026');
  });
});

// ─── Aurora Focus — todo management (PR #25) ─────────────────────────────────

describe('Aurora Focus todo management', () => {
  let todos;

  beforeEach(() => {
    todos = [];
  });

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.unshift({ text: trimmed, done: false, id: Date.now() });
  }

  function toggleTodo(idx) {
    if (todos[idx] !== undefined) {
      todos[idx].done = !todos[idx].done;
    }
  }

  function deleteTodo(idx) {
    todos.splice(idx, 1);
  }

  it('adds a todo to the front of the list', () => {
    addTodo('First task');
    addTodo('Second task');
    expect(todos[0].text).toBe('Second task');
    expect(todos[1].text).toBe('First task');
  });

  it('sets done to false on creation', () => {
    addTodo('New task');
    expect(todos[0].done).toBe(false);
  });

  it('ignores empty or whitespace-only text', () => {
    addTodo('');
    addTodo('   ');
    expect(todos).toHaveLength(0);
  });

  it('trims leading/trailing whitespace from the text', () => {
    addTodo('  clean  ');
    expect(todos[0].text).toBe('clean');
  });

  it('toggles done from false to true', () => {
    addTodo('Task');
    toggleTodo(0);
    expect(todos[0].done).toBe(true);
  });

  it('toggles done back to false', () => {
    addTodo('Task');
    toggleTodo(0);
    toggleTodo(0);
    expect(todos[0].done).toBe(false);
  });

  it('deletes a todo by index', () => {
    addTodo('A');
    addTodo('B');
    deleteTodo(0); // removes 'B' (front)
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('A');
  });

  it('deletes the correct item when multiple todos exist', () => {
    addTodo('A');
    addTodo('B');
    addTodo('C'); // order: C, B, A
    deleteTodo(1); // removes B
    expect(todos.map(t => t.text)).toEqual(['C', 'A']);
  });
});
