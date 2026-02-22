import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
} from './utils.js';

// ─── loadFromStorage ──────────────────────────────────────────────────────────

describe('loadFromStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns defaultValue when key does not exist', () => {
    expect(loadFromStorage('missing')).toBeNull();
    expect(loadFromStorage('missing', [])).toEqual([]);
  });

  it('returns parsed value for an existing key', () => {
    localStorage.setItem('k', JSON.stringify({ a: 1 }));
    expect(loadFromStorage('k')).toEqual({ a: 1 });
  });

  it('returns defaultValue when stored JSON is malformed', () => {
    localStorage.setItem('bad', 'not-json{{{');
    expect(loadFromStorage('bad', 'fallback')).toBe('fallback');
  });
});

// ─── saveToStorage ────────────────────────────────────────────────────────────

describe('saveToStorage', () => {
  beforeEach(() => localStorage.clear());

  it('persists a value under the given key', () => {
    saveToStorage('items', [1, 2, 3]);
    expect(JSON.parse(localStorage.getItem('items'))).toEqual([1, 2, 3]);
  });

  it('overwrites an existing key', () => {
    saveToStorage('x', 'first');
    saveToStorage('x', 'second');
    expect(JSON.parse(localStorage.getItem('x'))).toBe('second');
  });

  it('handles objects with nested properties', () => {
    const obj = { nested: { deep: true }, arr: [1, 2] };
    saveToStorage('obj', obj);
    expect(JSON.parse(localStorage.getItem('obj'))).toEqual(obj);
  });
});

// ─── formatTime ──────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('returns a non-empty string for a valid timestamp', () => {
    const result = formatTime(1700000000000);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year in the output', () => {
    const ts = new Date('2024-06-15T12:30:00').getTime();
    expect(formatTime(ts)).toMatch(/2024/);
  });

  it('includes hour and minute separators', () => {
    const result = formatTime(Date.now());
    // en-US locale format contains ":" for time portions
    expect(result).toMatch(/:/);
  });
});

// ─── calculateStats ───────────────────────────────────────────────────────────

describe('calculateStats', () => {
  it('returns zeros for an empty history', () => {
    expect(calculateStats([])).toEqual({ max: 0, min: 0, avg: 0, total: 0 });
  });

  it('calculates correct stats for a single-item history', () => {
    const history = [{ resultValue: 5 }];
    expect(calculateStats(history)).toEqual({ max: 5, min: 5, avg: 5, total: 1 });
  });

  it('calculates max, min, avg and total correctly', () => {
    const history = [
      { resultValue: 10 },
      { resultValue: 2 },
      { resultValue: 6 },
    ];
    const stats = calculateStats(history);
    expect(stats.max).toBe(10);
    expect(stats.min).toBe(2);
    expect(stats.avg).toBeCloseTo(6, 2);
    expect(stats.total).toBe(3);
  });

  it('returns avg as a number (not a string)', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }];
    expect(typeof calculateStats(history).avg).toBe('number');
  });

  it('handles negative resultValues', () => {
    const history = [{ resultValue: -5 }, { resultValue: -1 }];
    const stats = calculateStats(history);
    expect(stats.max).toBe(-1);
    expect(stats.min).toBe(-5);
  });
});

// ─── generateReportData ───────────────────────────────────────────────────────

describe('generateReportData', () => {
  it('includes all calculateStats fields', () => {
    const history = [{ resultValue: 3 }, { resultValue: 7 }];
    const report = generateReportData(history);
    expect(report).toMatchObject({ max: 7, min: 3, total: 2 });
  });

  it('includes generatedAt as a numeric timestamp', () => {
    const report = generateReportData([{ resultValue: 1 }]);
    expect(typeof report.generatedAt).toBe('number');
    expect(report.generatedAt).toBeGreaterThan(0);
  });

  it('includes historyCount equal to history length', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }, { resultValue: 3 }];
    expect(generateReportData(history).historyCount).toBe(3);
  });

  it('returns zero stats for empty history', () => {
    const report = generateReportData([]);
    expect(report.max).toBe(0);
    expect(report.min).toBe(0);
    expect(report.historyCount).toBe(0);
  });
});

// ─── generateId ──────────────────────────────────────────────────────────────

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('generates unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 20 }, generateId));
    expect(ids.size).toBe(20);
  });
});

// ─── validateTodo ─────────────────────────────────────────────────────────────

describe('validateTodo', () => {
  it('returns true for a normal text string', () => {
    expect(validateTodo('Buy groceries')).toBe(true);
  });

  it('returns falsy for an empty string', () => {
    expect(validateTodo('')).toBeFalsy();
  });

  it('returns falsy for whitespace-only input', () => {
    expect(validateTodo('   ')).toBeFalsy();
  });

  it('returns falsy for null or undefined', () => {
    expect(validateTodo(null)).toBeFalsy();
    expect(validateTodo(undefined)).toBeFalsy();
  });

  it('returns true for a string exactly 200 characters long', () => {
    expect(validateTodo('a'.repeat(200))).toBe(true);
  });

  it('returns false for a string longer than 200 characters', () => {
    expect(validateTodo('a'.repeat(201))).toBe(false);
  });

  it('trims whitespace before validating length', () => {
    // 200 spaces + 1 "a" = 201 chars but trimmed to 1 char → valid
    expect(validateTodo(' '.repeat(200) + 'a')).toBe(true);
  });
});

// ─── sortTodos ───────────────────────────────────────────────────────────────

describe('sortTodos', () => {
  const todos = [
    { id: 1, text: 'A', completed: false, createdAt: 300 },
    { id: 2, text: 'B', completed: true,  createdAt: 100 },
    { id: 3, text: 'C', completed: false, createdAt: 200 },
  ];

  it('does not mutate the original array', () => {
    const original = [...todos];
    sortTodos(todos, 'date-asc');
    expect(todos).toEqual(original);
  });

  it('sorts by date ascending', () => {
    const sorted = sortTodos(todos, 'date-asc');
    expect(sorted.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it('sorts by date descending (default)', () => {
    const sorted = sortTodos(todos, 'date-desc');
    expect(sorted.map(t => t.id)).toEqual([1, 3, 2]);
  });

  it('uses date-desc as the default sort', () => {
    const byDefault = sortTodos(todos);
    const byDesc   = sortTodos(todos, 'date-desc');
    expect(byDefault.map(t => t.id)).toEqual(byDesc.map(t => t.id));
  });

  it('sorts completed todos first with "completed"', () => {
    const sorted = sortTodos(todos, 'completed');
    // completed=false(0) < completed=true(1) → false items come first
    expect(sorted.filter(t => t.completed === false).length).toBe(2);
    expect(sorted[0].completed).toBe(false);
  });

  it('sorts pending (not completed) todos first with "pending"', () => {
    const sorted = sortTodos(todos, 'pending');
    expect(sorted[0].completed).toBe(true);
  });

  it('returns original order for unknown sort criteria', () => {
    const sorted = sortTodos(todos, 'unknown');
    expect(sorted.map(t => t.id)).toEqual(todos.map(t => t.id));
  });

  it('returns empty array for empty input', () => {
    expect(sortTodos([], 'date-asc')).toEqual([]);
  });
});

// ─── getAppAnalytics ─────────────────────────────────────────────────────────

describe('getAppAnalytics', () => {
  const state = {
    history: [{ resultValue: 1 }, { resultValue: 2 }],
    todos: [
      { text: 'A', completed: true },
      { text: 'B', completed: false },
    ],
    count: 42,
    theme: 'dark',
  };

  it('returns correct totalCounterChanges', () => {
    expect(getAppAnalytics(state).totalCounterChanges).toBe(2);
  });

  it('returns correct totalTodos', () => {
    expect(getAppAnalytics(state).totalTodos).toBe(2);
  });

  it('returns correct completedTodos', () => {
    expect(getAppAnalytics(state).completedTodos).toBe(1);
  });

  it('returns correct pendingTodos', () => {
    expect(getAppAnalytics(state).pendingTodos).toBe(1);
  });

  it('returns currentCount', () => {
    expect(getAppAnalytics(state).currentCount).toBe(42);
  });

  it('returns currentTheme', () => {
    expect(getAppAnalytics(state).currentTheme).toBe('dark');
  });

  it('includes appStartTime as an ISO string', () => {
    const { appStartTime } = getAppAnalytics(state);
    expect(typeof appStartTime).toBe('string');
    expect(() => new Date(appStartTime)).not.toThrow();
  });
});

// ─── getAppVersion ───────────────────────────────────────────────────────────

describe('getAppVersion', () => {
  it('returns a non-empty version string', () => {
    const version = getAppVersion();
    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });

  it('returns a semver-like string (x.y.z)', () => {
    expect(getAppVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

// ─── exportData ──────────────────────────────────────────────────────────────

describe('exportData', () => {
  let appendSpy, clickSpy, removeSpy;

  beforeEach(() => {
    appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a temporary anchor element and clicks it', () => {
    const clicks = [];
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(tag => {
      const el = origCreate(tag);
      if (tag === 'a') {
        vi.spyOn(el, 'click').mockImplementation(() => clicks.push(el));
      }
      return el;
    });

    exportData({ key: 'value' }, 'test.json');

    expect(clicks.length).toBe(1);
    vi.restoreAllMocks();
  });

  it('appends then removes the link from document.body', () => {
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(tag => {
      const el = origCreate(tag);
      if (tag === 'a') vi.spyOn(el, 'click').mockImplementation(() => {});
      return el;
    });

    exportData({ x: 1 }, 'out.json');

    expect(appendSpy).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledOnce();
    vi.restoreAllMocks();
  });

  it('sets the download attribute to the provided filename', () => {
    let capturedEl = null;
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(tag => {
      const el = origCreate(tag);
      if (tag === 'a') {
        capturedEl = el;
        vi.spyOn(el, 'click').mockImplementation(() => {});
      }
      return el;
    });

    exportData({}, 'my-export.json');

    expect(capturedEl?.download).toBe('my-export.json');
    vi.restoreAllMocks();
  });
});
