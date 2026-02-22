import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadFromStorage,
  saveToStorage,
  formatTime,
  calculateStats,
  generateReportData,
  generateId,
  validateTodo,
  sortTodos,
  getAppAnalytics,
  getAppVersion,
} from './utils.js';

// ─── loadFromStorage ─────────────────────────────────────────────────────────

describe('loadFromStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns defaultValue when key does not exist', () => {
    expect(loadFromStorage('missing', 'default')).toBe('default');
  });

  it('returns null by default when key does not exist and no default given', () => {
    expect(loadFromStorage('missing')).toBeNull();
  });

  it('returns parsed value for an existing key', () => {
    localStorage.setItem('test', JSON.stringify({ a: 1 }));
    expect(loadFromStorage('test')).toEqual({ a: 1 });
  });

  it('returns defaultValue when stored value is invalid JSON', () => {
    localStorage.setItem('test', 'not-valid-json{');
    expect(loadFromStorage('test', 'fallback')).toBe('fallback');
  });

  it('returns stored number correctly', () => {
    localStorage.setItem('count', JSON.stringify(42));
    expect(loadFromStorage('count', 0)).toBe(42);
  });

  it('returns stored array correctly', () => {
    localStorage.setItem('arr', JSON.stringify([1, 2, 3]));
    expect(loadFromStorage('arr', [])).toEqual([1, 2, 3]);
  });

  it('returns stored boolean false correctly (not the default)', () => {
    localStorage.setItem('flag', JSON.stringify(false));
    expect(loadFromStorage('flag', true)).toBe(false);
  });
});

// ─── saveToStorage ───────────────────────────────────────────────────────────

describe('saveToStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists a string value', () => {
    saveToStorage('key', 'hello');
    expect(JSON.parse(localStorage.getItem('key'))).toBe('hello');
  });

  it('persists a number value', () => {
    saveToStorage('count', 99);
    expect(JSON.parse(localStorage.getItem('count'))).toBe(99);
  });

  it('persists an object value', () => {
    saveToStorage('obj', { x: 1, y: 2 });
    expect(JSON.parse(localStorage.getItem('obj'))).toEqual({ x: 1, y: 2 });
  });

  it('persists an array value', () => {
    saveToStorage('arr', [10, 20, 30]);
    expect(JSON.parse(localStorage.getItem('arr'))).toEqual([10, 20, 30]);
  });

  it('overwrites a previously saved value', () => {
    saveToStorage('k', 'first');
    saveToStorage('k', 'second');
    expect(JSON.parse(localStorage.getItem('k'))).toBe('second');
  });

  it('round-trips with loadFromStorage', () => {
    const data = { todos: ['a', 'b'], count: 7 };
    saveToStorage('state', data);
    expect(loadFromStorage('state')).toEqual(data);
  });
});

// ─── formatTime ──────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('returns a non-empty string', () => {
    const result = formatTime(Date.now());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year in the output', () => {
    const ts = new Date('2024-01-01T12:00:00').getTime();
    expect(formatTime(ts)).toContain('2024');
  });

  it('includes the month abbreviation in the output', () => {
    const ts = new Date('2024-06-15T09:00:00').getTime();
    expect(formatTime(ts)).toMatch(/Jun/);
  });

  it('includes the day of month in the output', () => {
    const ts = new Date('2024-06-15T09:00:00').getTime();
    expect(formatTime(ts)).toMatch(/15/);
  });

  it('includes time components', () => {
    // just verify the format contains colons typical of time
    const result = formatTime(Date.now());
    expect(result).toMatch(/\d+:\d+/);
  });
});

// ─── calculateStats ──────────────────────────────────────────────────────────

describe('calculateStats', () => {
  it('returns all zeros for empty history', () => {
    expect(calculateStats([])).toEqual({ max: 0, min: 0, avg: 0, total: 0 });
  });

  it('calculates correct stats for a single entry', () => {
    const history = [{ resultValue: 5 }];
    const result = calculateStats(history);
    expect(result.max).toBe(5);
    expect(result.min).toBe(5);
    expect(result.avg).toBe(5);
    expect(result.total).toBe(1);
  });

  it('finds the correct maximum', () => {
    const history = [{ resultValue: 3 }, { resultValue: 9 }, { resultValue: 1 }];
    expect(calculateStats(history).max).toBe(9);
  });

  it('finds the correct minimum', () => {
    const history = [{ resultValue: 3 }, { resultValue: 9 }, { resultValue: 1 }];
    expect(calculateStats(history).min).toBe(1);
  });

  it('calculates the correct average', () => {
    const history = [{ resultValue: 2 }, { resultValue: 4 }, { resultValue: 6 }];
    expect(calculateStats(history).avg).toBe(4);
  });

  it('returns total equal to history length', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }, { resultValue: 3 }];
    expect(calculateStats(history).total).toBe(3);
  });

  it('handles negative result values', () => {
    const history = [{ resultValue: -5 }, { resultValue: -1 }, { resultValue: -3 }];
    const result = calculateStats(history);
    expect(result.max).toBe(-1);
    expect(result.min).toBe(-5);
    expect(result.avg).toBeCloseTo(-3, 2);
  });

  it('rounds average to 2 decimal places', () => {
    // 1+2+3+4+5 = 15 / 5 = 3 (exact)
    const history = [1, 2, 3, 4, 5].map(v => ({ resultValue: v }));
    expect(calculateStats(history).avg).toBe(3);
  });

  it('returns avg as a number (not a string)', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }];
    expect(typeof calculateStats(history).avg).toBe('number');
  });

  it('handles identical values', () => {
    const history = [{ resultValue: 7 }, { resultValue: 7 }, { resultValue: 7 }];
    const result = calculateStats(history);
    expect(result.max).toBe(7);
    expect(result.min).toBe(7);
    expect(result.avg).toBe(7);
  });
});

// ─── generateReportData ──────────────────────────────────────────────────────

describe('generateReportData', () => {
  it('includes all stats fields', () => {
    const result = generateReportData([{ resultValue: 5 }]);
    expect(result).toHaveProperty('max');
    expect(result).toHaveProperty('min');
    expect(result).toHaveProperty('avg');
    expect(result).toHaveProperty('total');
  });

  it('includes generatedAt as a numeric timestamp', () => {
    const result = generateReportData([]);
    expect(typeof result.generatedAt).toBe('number');
    expect(result.generatedAt).toBeGreaterThan(0);
  });

  it('includes historyCount equal to history array length', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }];
    expect(generateReportData(history).historyCount).toBe(2);
  });

  it('handles empty history without throwing', () => {
    const result = generateReportData([]);
    expect(result.historyCount).toBe(0);
    expect(result.max).toBe(0);
    expect(result.min).toBe(0);
  });

  it('stats match calculateStats output', () => {
    const history = [{ resultValue: 3 }, { resultValue: 7 }];
    const report = generateReportData(history);
    const stats = calculateStats(history);
    expect(report.max).toBe(stats.max);
    expect(report.min).toBe(stats.min);
    expect(report.avg).toBe(stats.avg);
    expect(report.total).toBe(stats.total);
  });
});

// ─── generateId ──────────────────────────────────────────────────────────────

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns a non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('generates unique IDs across multiple calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

// ─── validateTodo ────────────────────────────────────────────────────────────

describe('validateTodo', () => {
  it('returns true for a normal text string', () => {
    expect(validateTodo('Buy groceries')).toBe(true);
  });

  it('returns falsy for an empty string', () => {
    expect(validateTodo('')).toBeFalsy();
  });

  it('returns falsy for a whitespace-only string', () => {
    expect(validateTodo('   ')).toBeFalsy();
  });

  it('returns falsy for null', () => {
    expect(validateTodo(null)).toBeFalsy();
  });

  it('returns falsy for undefined', () => {
    expect(validateTodo(undefined)).toBeFalsy();
  });

  it('returns falsy for text longer than 200 characters', () => {
    expect(validateTodo('a'.repeat(201))).toBeFalsy();
  });

  it('returns true for text exactly 200 characters long', () => {
    expect(validateTodo('a'.repeat(200))).toBe(true);
  });

  it('returns true for a single character', () => {
    expect(validateTodo('x')).toBe(true);
  });

  it('trims surrounding whitespace before checking length', () => {
    expect(validateTodo('  hello  ')).toBe(true);
  });

  it('returns false when trimmed length is 0', () => {
    expect(validateTodo('\t\n  ')).toBe(false);
  });
});

// ─── sortTodos ───────────────────────────────────────────────────────────────

describe('sortTodos', () => {
  const now = Date.now();
  const todos = [
    { id: 1, text: 'First',  completed: false, createdAt: now - 3000 },
    { id: 2, text: 'Second', completed: true,  createdAt: now - 2000 },
    { id: 3, text: 'Third',  completed: false, createdAt: now - 1000 },
  ];

  it('date-asc puts the oldest item first', () => {
    const result = sortTodos(todos, 'date-asc');
    expect(result[0].id).toBe(1);
    expect(result[2].id).toBe(3);
  });

  it('date-desc puts the newest item first', () => {
    const result = sortTodos(todos, 'date-desc');
    expect(result[0].id).toBe(3);
    expect(result[2].id).toBe(1);
  });

  it("'pending' comparator places completed items before pending ones", () => {
    // The comparator is (a, b) => b.completed - a.completed, which evaluates
    // to a positive number when b is completed, so completed items sort first.
    const result = sortTodos(todos, 'pending');
    expect(result[0].completed).toBe(true);
  });

  it("'completed' comparator places pending items before completed ones", () => {
    // The comparator is (a, b) => a.completed - b.completed, which evaluates
    // to a negative number when a is pending, so pending items sort first.
    const result = sortTodos(todos, 'completed');
    expect(result[0].completed).toBe(false);
  });

  it('returns the array unchanged for an unknown sortBy value', () => {
    const result = sortTodos(todos, 'unknown');
    expect(result).toEqual(todos);
  });

  it('defaults to date-desc when no sortBy is provided', () => {
    const result = sortTodos(todos);
    expect(result[0].id).toBe(3);
  });

  it('does not mutate the original array', () => {
    const original = todos.map(t => ({ ...t }));
    sortTodos(todos, 'date-asc');
    expect(todos[0].id).toBe(original[0].id);
  });

  it('returns an empty array for empty input', () => {
    expect(sortTodos([], 'date-asc')).toEqual([]);
  });

  it('handles a single-element array for every sort mode', () => {
    const single = [{ id: 9, completed: false, createdAt: now }];
    ['date-asc', 'date-desc', 'pending', 'completed'].forEach(mode => {
      expect(sortTodos(single, mode)).toHaveLength(1);
    });
  });
});

// ─── getAppAnalytics ─────────────────────────────────────────────────────────

describe('getAppAnalytics', () => {
  it('returns correct totalCounterChanges', () => {
    const state = { history: [1, 2], todos: [], count: 0, theme: 'light' };
    expect(getAppAnalytics(state).totalCounterChanges).toBe(2);
  });

  it('returns correct totalTodos', () => {
    const state = {
      history: [],
      todos: [{ completed: true }, { completed: false }],
      count: 0,
      theme: 'light',
    };
    expect(getAppAnalytics(state).totalTodos).toBe(2);
  });

  it('returns correct completedTodos count', () => {
    const state = {
      history: [],
      todos: [{ completed: true }, { completed: false }, { completed: true }],
      count: 0,
      theme: 'dark',
    };
    expect(getAppAnalytics(state).completedTodos).toBe(2);
  });

  it('returns correct pendingTodos count', () => {
    const state = {
      history: [],
      todos: [{ completed: true }, { completed: false }, { completed: false }],
      count: 0,
      theme: 'light',
    };
    expect(getAppAnalytics(state).pendingTodos).toBe(2);
  });

  it('returns currentCount from state', () => {
    const state = { history: [], todos: [], count: 42, theme: 'light' };
    expect(getAppAnalytics(state).currentCount).toBe(42);
  });

  it('returns currentTheme from state', () => {
    const state = { history: [], todos: [], count: 0, theme: 'dark' };
    expect(getAppAnalytics(state).currentTheme).toBe('dark');
  });

  it('returns appStartTime as an ISO 8601 string', () => {
    const state = { history: [], todos: [], count: 0, theme: 'light' };
    const result = getAppAnalytics(state);
    expect(typeof result.appStartTime).toBe('string');
    expect(result.appStartTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('handles an empty state without throwing', () => {
    const state = { history: [], todos: [], count: 0, theme: 'auto' };
    const result = getAppAnalytics(state);
    expect(result.totalCounterChanges).toBe(0);
    expect(result.totalTodos).toBe(0);
    expect(result.completedTodos).toBe(0);
    expect(result.pendingTodos).toBe(0);
  });
});

// ─── getAppVersion ───────────────────────────────────────────────────────────

describe('getAppVersion', () => {
  it('returns a string', () => {
    expect(typeof getAppVersion()).toBe('string');
  });

  it('returns a semver-like version', () => {
    expect(getAppVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('returns the expected version', () => {
    expect(getAppVersion()).toBe('3.0.0');
  });
});
