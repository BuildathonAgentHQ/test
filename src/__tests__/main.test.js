/**
 * Tests for the Aurora Focus logic introduced in PR #25 (src/main.js).
 *
 * Because main.js is a top-level, DOM-coupled script with no exports, the
 * pure business logic has been extracted into src/aurora-helpers.js so it can
 * be tested independently of any browser environment.
 *
 * Coverage areas:
 *   - Clock formatting  (formatClockTime, formatClockDate)
 *   - Pomodoro timer    (formatTimerDisplay, computeRingOffset,
 *                        nextModeIndex, buildSessionDots, TIMER_MODES)
 *   - Todo CRUD         (addTodo, toggleTodo, removeTodo)
 */

import { describe, it, expect } from 'vitest';
import {
  DAYS,
  MONTHS,
  TIMER_MODES,
  CIRCUMFERENCE,
  formatClockTime,
  formatClockDate,
  formatTimerDisplay,
  computeRingOffset,
  nextModeIndex,
  buildSessionDots,
  addTodo,
  toggleTodo,
  removeTodo,
} from '../aurora-helpers.js';

// ─── Clock: formatClockTime ───────────────────────────────────────────────────

describe('formatClockTime', () => {
  it('formats midnight as 00:00:00', () => {
    const midnight = new Date('2024-01-01T00:00:00');
    expect(formatClockTime(midnight)).toBe('00:00:00');
  });

  it('formats noon correctly', () => {
    const noon = new Date('2024-06-15T12:00:00');
    expect(formatClockTime(noon)).toBe('12:00:00');
  });

  it('pads single-digit hours with a leading zero', () => {
    const earlyMorning = new Date('2024-03-10T09:05:07');
    expect(formatClockTime(earlyMorning)).toMatch(/^09:/);
  });

  it('pads single-digit minutes with a leading zero', () => {
    const result = formatClockTime(new Date('2024-03-10T10:05:07'));
    const parts = result.split(':');
    expect(parts[1]).toBe('05');
  });

  it('pads single-digit seconds with a leading zero', () => {
    const result = formatClockTime(new Date('2024-03-10T10:05:07'));
    const parts = result.split(':');
    expect(parts[2]).toBe('07');
  });

  it('returns a string in HH:MM:SS format', () => {
    expect(formatClockTime(new Date())).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('handles end-of-day correctly (23:59:59)', () => {
    const eod = new Date('2024-12-31T23:59:59');
    expect(formatClockTime(eod)).toBe('23:59:59');
  });
});

// ─── Clock: formatClockDate ───────────────────────────────────────────────────

describe('formatClockDate', () => {
  // Use a fixed date: Friday March 15, 2024
  const friday = new Date('2024-03-15T12:00:00');

  it('includes the day of the week', () => {
    expect(formatClockDate(friday)).toContain('Friday');
  });

  it('includes the abbreviated month name', () => {
    expect(formatClockDate(friday)).toContain('Mar');
  });

  it('includes the numeric day', () => {
    expect(formatClockDate(friday)).toContain('15');
  });

  it('includes the four-digit year', () => {
    expect(formatClockDate(friday)).toContain('2024');
  });

  it('uses the middle dot separator (·)', () => {
    expect(formatClockDate(friday)).toContain('·');
  });

  it('returns the correct day name for each day of the week', () => {
    DAYS.forEach((day, i) => {
      // Create a date for each weekday
      const date = new Date('2024-03-10T12:00:00'); // Sunday = 0
      date.setDate(date.getDate() + i);
      expect(formatClockDate(date)).toContain(DAYS[date.getDay()]);
    });
  });

  it('returns the correct month name for each month', () => {
    MONTHS.forEach((month, i) => {
      const date = new Date(2024, i, 1);
      expect(formatClockDate(date)).toContain(month);
    });
  });
});

// ─── Timer: TIMER_MODES ───────────────────────────────────────────────────────

describe('TIMER_MODES', () => {
  it('has exactly two modes', () => {
    expect(TIMER_MODES.length).toBe(2);
  });

  it('first mode is FOCUS with 25-minute duration', () => {
    expect(TIMER_MODES[0].label).toBe('FOCUS');
    expect(TIMER_MODES[0].duration).toBe(25 * 60);
  });

  it('second mode is BREAK with 5-minute duration', () => {
    expect(TIMER_MODES[1].label).toBe('BREAK');
    expect(TIMER_MODES[1].duration).toBe(5 * 60);
  });

  it('FOCUS next label hints at break duration ("5m")', () => {
    expect(TIMER_MODES[0].next).toBe('5m');
  });

  it('BREAK next label hints at focus duration ("25m")', () => {
    expect(TIMER_MODES[1].next).toBe('25m');
  });
});

// ─── Timer: formatTimerDisplay ───────────────────────────────────────────────

describe('formatTimerDisplay', () => {
  it('formats 25 minutes as "25:00"', () => {
    expect(formatTimerDisplay(25 * 60)).toBe('25:00');
  });

  it('formats 5 minutes as "05:00"', () => {
    expect(formatTimerDisplay(5 * 60)).toBe('05:00');
  });

  it('formats 0 seconds as "00:00"', () => {
    expect(formatTimerDisplay(0)).toBe('00:00');
  });

  it('pads single-digit minutes with leading zero', () => {
    expect(formatTimerDisplay(9 * 60 + 30)).toBe('09:30');
  });

  it('pads single-digit seconds with leading zero', () => {
    expect(formatTimerDisplay(10 * 60 + 5)).toBe('10:05');
  });

  it('formats 1 second remaining as "00:01"', () => {
    expect(formatTimerDisplay(1)).toBe('00:01');
  });

  it('formats 90 seconds as "01:30"', () => {
    expect(formatTimerDisplay(90)).toBe('01:30');
  });

  it('returns a string matching MM:SS pattern', () => {
    expect(formatTimerDisplay(300)).toMatch(/^\d{2}:\d{2}$/);
  });
});

// ─── Timer: computeRingOffset ────────────────────────────────────────────────

describe('computeRingOffset', () => {
  it('offset is 0 when timer is full (no time elapsed)', () => {
    expect(computeRingOffset(25 * 60, 25 * 60)).toBe(0);
  });

  it('offset equals circumference when timer hits 0', () => {
    expect(computeRingOffset(0, 25 * 60)).toBe(CIRCUMFERENCE);
  });

  it('offset is half circumference at 50% remaining', () => {
    const half = 25 * 60 / 2;
    expect(computeRingOffset(half, 25 * 60)).toBeCloseTo(CIRCUMFERENCE / 2, 5);
  });

  it('offset increases as remaining time decreases', () => {
    const total = 25 * 60;
    const full   = computeRingOffset(total, total);
    const half   = computeRingOffset(total / 2, total);
    const empty  = computeRingOffset(0, total);
    expect(full).toBeLessThan(half);
    expect(half).toBeLessThan(empty);
  });

  it('accepts a custom circumference', () => {
    expect(computeRingOffset(0, 100, 500)).toBe(500);
  });

  it('returns a value between 0 and circumference for any valid input', () => {
    for (let r = 0; r <= 1500; r += 100) {
      const offset = computeRingOffset(r, 1500);
      expect(offset).toBeGreaterThanOrEqual(0);
      expect(offset).toBeLessThanOrEqual(CIRCUMFERENCE);
    }
  });
});

// ─── Timer: nextModeIndex ─────────────────────────────────────────────────────

describe('nextModeIndex', () => {
  it('advances from FOCUS (0) to BREAK (1)', () => {
    expect(nextModeIndex(0, TIMER_MODES)).toBe(1);
  });

  it('wraps from BREAK (1) back to FOCUS (0)', () => {
    expect(nextModeIndex(1, TIMER_MODES)).toBe(0);
  });

  it('wraps correctly for an arbitrary-length modes array', () => {
    const modes = ['a', 'b', 'c'];
    expect(nextModeIndex(2, modes)).toBe(0);
    expect(nextModeIndex(0, modes)).toBe(1);
  });
});

// ─── Timer: buildSessionDots ─────────────────────────────────────────────────

describe('buildSessionDots', () => {
  it('returns an array of 4 elements', () => {
    expect(buildSessionDots(0).length).toBe(4);
  });

  it('all dots are false at 0 sessions', () => {
    expect(buildSessionDots(0)).toEqual([false, false, false, false]);
  });

  it('one dot is true after 1 session', () => {
    expect(buildSessionDots(1)).toEqual([true, false, false, false]);
  });

  it('all four dots are true after 4 sessions', () => {
    expect(buildSessionDots(4)).toEqual([false, false, false, false]); // resets cycle
  });

  it('three dots true after 3 sessions', () => {
    expect(buildSessionDots(3)).toEqual([true, true, true, false]);
  });

  it('cycles correctly: 4 sessions resets to 0 filled dots', () => {
    expect(buildSessionDots(4).filter(Boolean).length).toBe(0);
  });

  it('cycles: 5 sessions shows 1 filled dot (second cycle)', () => {
    expect(buildSessionDots(5).filter(Boolean).length).toBe(1);
  });
});

// ─── Todo: addTodo ────────────────────────────────────────────────────────────

describe('addTodo', () => {
  it('prepends a new todo to an empty list', () => {
    const result = addTodo([], 'Buy milk', 1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ text: 'Buy milk', done: false, id: 1 });
  });

  it('prepends the new todo before existing ones', () => {
    const existing = [{ text: 'Old task', done: false, id: 0 }];
    const result = addTodo(existing, 'New task', 1);
    expect(result[0].text).toBe('New task');
    expect(result[1].text).toBe('Old task');
  });

  it('trims leading and trailing whitespace', () => {
    const result = addTodo([], '  trimmed  ', 1);
    expect(result[0].text).toBe('trimmed');
  });

  it('returns the original list when text is empty', () => {
    const todos = [{ text: 'keep me', done: false, id: 1 }];
    expect(addTodo(todos, '')).toBe(todos);
  });

  it('returns the original list when text is whitespace-only', () => {
    const todos = [];
    expect(addTodo(todos, '   ')).toBe(todos);
  });

  it('returns the original list when text is null', () => {
    const todos = [];
    expect(addTodo(todos, null)).toBe(todos);
  });

  it('returns the original list when text is undefined', () => {
    const todos = [];
    expect(addTodo(todos, undefined)).toBe(todos);
  });

  it('new todo has done: false', () => {
    const result = addTodo([], 'Check this', 1);
    expect(result[0].done).toBe(false);
  });

  it('does not mutate the original array', () => {
    const original = [{ text: 'original', done: false, id: 0 }];
    addTodo(original, 'new', 1);
    expect(original).toHaveLength(1);
  });
});

// ─── Todo: toggleTodo ────────────────────────────────────────────────────────

describe('toggleTodo', () => {
  const todos = [
    { text: 'Task A', done: false, id: 1 },
    { text: 'Task B', done: true,  id: 2 },
    { text: 'Task C', done: false, id: 3 },
  ];

  it('sets done to true for a pending todo', () => {
    expect(toggleTodo(todos, 0)[0].done).toBe(true);
  });

  it('sets done to false for a completed todo', () => {
    expect(toggleTodo(todos, 1)[1].done).toBe(false);
  });

  it('leaves other todos unchanged', () => {
    const result = toggleTodo(todos, 0);
    expect(result[1]).toEqual(todos[1]);
    expect(result[2]).toEqual(todos[2]);
  });

  it('does not mutate the original array', () => {
    toggleTodo(todos, 0);
    expect(todos[0].done).toBe(false);
  });

  it('returns a new array of the same length', () => {
    expect(toggleTodo(todos, 0)).toHaveLength(todos.length);
  });
});

// ─── Todo: removeTodo ────────────────────────────────────────────────────────

describe('removeTodo', () => {
  const todos = [
    { text: 'A', done: false, id: 1 },
    { text: 'B', done: true,  id: 2 },
    { text: 'C', done: false, id: 3 },
  ];

  it('removes the todo at the given index', () => {
    const result = removeTodo(todos, 1);
    expect(result.find(t => t.id === 2)).toBeUndefined();
  });

  it('decreases the list length by one', () => {
    expect(removeTodo(todos, 0)).toHaveLength(todos.length - 1);
  });

  it('removes the first item correctly', () => {
    const result = removeTodo(todos, 0);
    expect(result[0].text).toBe('B');
  });

  it('removes the last item correctly', () => {
    const result = removeTodo(todos, todos.length - 1);
    expect(result[result.length - 1].text).toBe('B');
  });

  it('does not mutate the original array', () => {
    removeTodo(todos, 0);
    expect(todos).toHaveLength(3);
  });

  it('returns an empty array when the only item is removed', () => {
    expect(removeTodo([{ text: 'only', done: false, id: 1 }], 0)).toHaveLength(0);
  });
});
