import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  exportData,
} from '../utils.js';

// ─── loadFromStorage ──────────────────────────────────────────────────────────

describe('loadFromStorage', () => {
  it('returns the default value when the key is absent', () => {
    expect(loadFromStorage('missing-key', 42)).toBe(42);
  });

  it('returns null as default when no default is supplied', () => {
    expect(loadFromStorage('missing-key')).toBeNull();
  });

  it('returns the stored value for an existing key', () => {
    localStorage.setItem('count', JSON.stringify(7));
    expect(loadFromStorage('count', 0)).toBe(7);
  });

  it('returns stored arrays correctly', () => {
    const arr = [{ id: 1, text: 'Buy milk' }];
    localStorage.setItem('todos', JSON.stringify(arr));
    expect(loadFromStorage('todos', [])).toEqual(arr);
  });

  it('returns the default value when stored JSON is invalid', () => {
    localStorage.setItem('bad', 'not-json{{{');
    expect(loadFromStorage('bad', 'fallback')).toBe('fallback');
  });
});

// ─── saveToStorage ────────────────────────────────────────────────────────────

describe('saveToStorage', () => {
  it('persists a primitive value', () => {
    saveToStorage('score', 99);
    expect(JSON.parse(localStorage.getItem('score'))).toBe(99);
  });

  it('persists an object', () => {
    const obj = { name: 'Alice', done: false };
    saveToStorage('user', obj);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(obj);
  });

  it('persists an array', () => {
    saveToStorage('list', [1, 2, 3]);
    expect(JSON.parse(localStorage.getItem('list'))).toEqual([1, 2, 3]);
  });

  it('does not throw when localStorage.setItem errors', () => {
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => saveToStorage('key', 'value')).not.toThrow();
    spy.mockRestore();
  });
});

// ─── formatTime ───────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('returns a non-empty string for a valid timestamp', () => {
    const result = formatTime(Date.now());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year in the output', () => {
    const ts = new Date('2024-06-15T10:30:00').getTime();
    expect(formatTime(ts)).toMatch(/2024/);
  });

  it('produces different strings for different timestamps', () => {
    const t1 = new Date('2024-01-01').getTime();
    const t2 = new Date('2024-12-31').getTime();
    expect(formatTime(t1)).not.toBe(formatTime(t2));
  });
});

// ─── calculateStats ───────────────────────────────────────────────────────────

describe('calculateStats', () => {
  it('returns all zeros for empty history', () => {
    expect(calculateStats([])).toEqual({ max: 0, min: 0, avg: 0, total: 0 });
  });

  it('returns correct stats for a single entry', () => {
    const history = [{ resultValue: 5 }];
    const stats = calculateStats(history);
    expect(stats.max).toBe(5);
    expect(stats.min).toBe(5);
    expect(stats.avg).toBe(5);
    expect(stats.total).toBe(1);
  });

  it('returns correct max, min, avg and total for multiple entries', () => {
    const history = [
      { resultValue: 10 },
      { resultValue: 2 },
      { resultValue: 6 },
    ];
    const stats = calculateStats(history);
    expect(stats.max).toBe(10);
    expect(stats.min).toBe(2);
    expect(stats.avg).toBeCloseTo(6);
    expect(stats.total).toBe(3);
  });

  it('handles negative result values', () => {
    const history = [{ resultValue: -3 }, { resultValue: 7 }];
    const stats = calculateStats(history);
    expect(stats.max).toBe(7);
    expect(stats.min).toBe(-3);
    expect(stats.avg).toBeCloseTo(2);
  });

  it('returns avg as a number (not a string)', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }];
    expect(typeof calculateStats(history).avg).toBe('number');
  });
});

// ─── generateReportData ───────────────────────────────────────────────────────

describe('generateReportData', () => {
  it('includes all fields from calculateStats', () => {
    const history = [{ resultValue: 10 }, { resultValue: 20 }];
    const report = generateReportData(history);
    expect(report).toHaveProperty('max');
    expect(report).toHaveProperty('min');
    expect(report).toHaveProperty('avg');
    expect(report).toHaveProperty('total');
  });

  it('includes generatedAt as a number (timestamp)', () => {
    const report = generateReportData([{ resultValue: 5 }]);
    expect(typeof report.generatedAt).toBe('number');
    expect(report.generatedAt).toBeGreaterThan(0);
  });

  it('includes historyCount equal to history length', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }, { resultValue: 3 }];
    const report = generateReportData(history);
    expect(report.historyCount).toBe(3);
  });

  it('historyCount is 0 for empty history', () => {
    const report = generateReportData([]);
    expect(report.historyCount).toBe(0);
  });
});

// ─── generateId ───────────────────────────────────────────────────────────────

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('returns a unique value on each call', () => {
    const ids = new Set(Array.from({ length: 20 }, () => String(generateId())));
    expect(ids.size).toBe(20);
  });
});

// ─── validateTodo ─────────────────────────────────────────────────────────────

describe('validateTodo', () => {
  it('returns true for a normal string', () => {
    expect(validateTodo('Buy groceries')).toBe(true);
  });

  it('returns falsy for an empty string', () => {
    // Short-circuit evaluation returns '' (falsy), not strict false
    expect(validateTodo('')).toBeFalsy();
  });

  it('returns falsy for a whitespace-only string', () => {
    expect(validateTodo('   ')).toBeFalsy();
  });

  it('returns falsy for null', () => {
    // Short-circuit evaluation returns null (falsy), not strict false
    expect(validateTodo(null)).toBeFalsy();
  });

  it('returns falsy for undefined', () => {
    // Short-circuit evaluation returns undefined (falsy), not strict false
    expect(validateTodo(undefined)).toBeFalsy();
  });

  it('returns true for a string of exactly 200 characters', () => {
    expect(validateTodo('a'.repeat(200))).toBe(true);
  });

  it('returns false for a string of 201 characters', () => {
    expect(validateTodo('a'.repeat(201))).toBe(false);
  });

  it('returns true for a single character', () => {
    expect(validateTodo('x')).toBe(true);
  });
});

// ─── sortTodos ────────────────────────────────────────────────────────────────

describe('sortTodos', () => {
  const makeTodo = (id, createdAt, completed) => ({ id, createdAt, completed });

  const todos = [
    makeTodo(1, 100, false),
    makeTodo(2, 300, true),
    makeTodo(3, 200, false),
  ];

  it('sorts by date-desc (newest first) by default', () => {
    const sorted = sortTodos(todos);
    expect(sorted.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it('sorts by date-desc explicitly', () => {
    const sorted = sortTodos(todos, 'date-desc');
    expect(sorted.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it('sorts by date-asc (oldest first)', () => {
    const sorted = sortTodos(todos, 'date-asc');
    expect(sorted.map(t => t.id)).toEqual([1, 3, 2]);
  });

  it('sorts by completed (false first, true last)', () => {
    const sorted = sortTodos(todos, 'completed');
    // All false before true — completed=false sorts before completed=true
    const doneValues = sorted.map(t => t.completed);
    const firstTrueIndex = doneValues.indexOf(true);
    expect(doneValues.slice(0, firstTrueIndex).every(v => !v)).toBe(true);
  });

  it('sorts by pending (true first, false last)', () => {
    const sorted = sortTodos(todos, 'pending');
    expect(sorted[0].completed).toBe(true);
  });

  it('returns original order for unknown sort criteria', () => {
    const sorted = sortTodos(todos, 'unknown');
    expect(sorted.map(t => t.id)).toEqual([1, 2, 3]);
  });

  it('does not mutate the original array', () => {
    const original = [...todos];
    sortTodos(todos, 'date-asc');
    expect(todos).toEqual(original);
  });

  it('returns an empty array for empty input', () => {
    expect(sortTodos([], 'date-desc')).toEqual([]);
  });
});

// ─── getAppAnalytics ─────────────────────────────────────────────────────────

describe('getAppAnalytics', () => {
  const state = {
    history: [{ resultValue: 1 }, { resultValue: 2 }],
    todos: [
      { id: 1, completed: true },
      { id: 2, completed: false },
      { id: 3, completed: false },
    ],
    count: 5,
    theme: 'dark',
  };

  it('returns totalCounterChanges equal to history length', () => {
    expect(getAppAnalytics(state).totalCounterChanges).toBe(2);
  });

  it('returns totalTodos equal to todos length', () => {
    expect(getAppAnalytics(state).totalTodos).toBe(3);
  });

  it('returns completedTodos count', () => {
    expect(getAppAnalytics(state).completedTodos).toBe(1);
  });

  it('returns pendingTodos count', () => {
    expect(getAppAnalytics(state).pendingTodos).toBe(2);
  });

  it('returns currentCount', () => {
    expect(getAppAnalytics(state).currentCount).toBe(5);
  });

  it('returns currentTheme', () => {
    expect(getAppAnalytics(state).currentTheme).toBe('dark');
  });

  it('returns appStartTime as an ISO string', () => {
    const result = getAppAnalytics(state);
    expect(typeof result.appStartTime).toBe('string');
    expect(result.appStartTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('handles empty state', () => {
    const empty = { history: [], todos: [], count: 0, theme: 'light' };
    const result = getAppAnalytics(empty);
    expect(result.totalCounterChanges).toBe(0);
    expect(result.totalTodos).toBe(0);
    expect(result.completedTodos).toBe(0);
    expect(result.pendingTodos).toBe(0);
  });
});

// ─── getAppVersion ────────────────────────────────────────────────────────────

describe('getAppVersion', () => {
  it('returns a version string', () => {
    expect(typeof getAppVersion()).toBe('string');
  });

  it('returns "3.0.0"', () => {
    expect(getAppVersion()).toBe('3.0.0');
  });
});

// ─── exportData ───────────────────────────────────────────────────────────────

describe('exportData', () => {
  it('creates an anchor element and triggers a click', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    const clickSpy = vi.fn();

    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementationOnce((tag) => {
      const el = origCreate(tag);
      el.click = clickSpy;
      return el;
    });

    exportData({ count: 42 }, 'test.json');

    expect(clickSpy).toHaveBeenCalledOnce();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('revokes the object URL after the download', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementationOnce((tag) => {
      const el = origCreate(tag);
      el.click = vi.fn();
      return el;
    });

    exportData({ value: 1 }, 'out.json');

    expect(revokeSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
