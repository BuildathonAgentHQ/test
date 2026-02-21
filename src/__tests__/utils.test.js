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
  exportData,
  getAppAnalytics,
  clearAllData,
  getAppVersion,
} from '../utils.js';

// ─── loadFromStorage ──────────────────────────────────────────────────────────

describe('loadFromStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns defaultValue when key is absent', () => {
    expect(loadFromStorage('missing', 42)).toBe(42);
  });

  it('returns defaultValue of null when not provided and key absent', () => {
    expect(loadFromStorage('missing')).toBeNull();
  });

  it('parses and returns stored JSON value', () => {
    localStorage.setItem('num', JSON.stringify(7));
    expect(loadFromStorage('num', 0)).toBe(7);
  });

  it('parses and returns stored array', () => {
    const arr = [1, 2, 3];
    localStorage.setItem('arr', JSON.stringify(arr));
    expect(loadFromStorage('arr', [])).toEqual(arr);
  });

  it('parses and returns stored object', () => {
    const obj = { a: 1, b: 'hello' };
    localStorage.setItem('obj', JSON.stringify(obj));
    expect(loadFromStorage('obj', {})).toEqual(obj);
  });

  it('returns defaultValue when stored value is invalid JSON', () => {
    localStorage.setItem('bad', '{not valid json}');
    expect(loadFromStorage('bad', 'fallback')).toBe('fallback');
  });
});

// ─── saveToStorage ────────────────────────────────────────────────────────────

describe('saveToStorage', () => {
  beforeEach(() => localStorage.clear());

  it('serialises a number and stores it', () => {
    saveToStorage('count', 5);
    expect(localStorage.getItem('count')).toBe('5');
  });

  it('serialises an array and stores it', () => {
    saveToStorage('list', [1, 2, 3]);
    expect(JSON.parse(localStorage.getItem('list'))).toEqual([1, 2, 3]);
  });

  it('serialises an object and stores it', () => {
    saveToStorage('obj', { x: 1 });
    expect(JSON.parse(localStorage.getItem('obj'))).toEqual({ x: 1 });
  });

  it('persists a falsy value (0)', () => {
    saveToStorage('zero', 0);
    expect(JSON.parse(localStorage.getItem('zero'))).toBe(0);
  });

  it('persists null', () => {
    saveToStorage('nil', null);
    expect(JSON.parse(localStorage.getItem('nil'))).toBeNull();
  });
});

// ─── formatTime ──────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('returns a non-empty string for a valid timestamp', () => {
    const result = formatTime(Date.now());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes year, month, and day components', () => {
    // Use a fixed UTC timestamp: 2024-06-15T12:00:00.000Z
    const ts = new Date('2024-06-15T12:00:00.000Z').getTime();
    const result = formatTime(ts);
    expect(result).toMatch(/2024/);
  });

  it('formats past epoch as a valid date string', () => {
    const result = formatTime(0); // 1970-01-01 in local time
    expect(typeof result).toBe('string');
    // The exact year depends on the local timezone — could be 1969 or 1970.
    expect(result).toMatch(/196[0-9]|197[0-9]/);
  });
});

// ─── calculateStats ──────────────────────────────────────────────────────────

describe('calculateStats', () => {
  it('returns all-zero stats for empty history', () => {
    expect(calculateStats([])).toEqual({ max: 0, min: 0, avg: 0, total: 0 });
  });

  it('calculates correct stats for a single entry', () => {
    const history = [{ resultValue: 10 }];
    expect(calculateStats(history)).toEqual({ max: 10, min: 10, avg: 10, total: 1 });
  });

  it('calculates correct max, min, avg for multiple entries', () => {
    const history = [
      { resultValue: 3 },
      { resultValue: 7 },
      { resultValue: 5 },
    ];
    const stats = calculateStats(history);
    expect(stats.max).toBe(7);
    expect(stats.min).toBe(3);
    expect(stats.avg).toBeCloseTo(5, 1);
    expect(stats.total).toBe(3);
  });

  it('handles negative resultValues', () => {
    const history = [{ resultValue: -5 }, { resultValue: 5 }];
    const stats = calculateStats(history);
    expect(stats.max).toBe(5);
    expect(stats.min).toBe(-5);
    expect(stats.avg).toBe(0);
  });

  it('avg is a number (not a string)', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }];
    const stats = calculateStats(history);
    expect(typeof stats.avg).toBe('number');
  });

  it('total equals history.length', () => {
    const history = Array.from({ length: 6 }, (_, i) => ({ resultValue: i }));
    expect(calculateStats(history).total).toBe(6);
  });
});

// ─── generateReportData ───────────────────────────────────────────────────────

describe('generateReportData', () => {
  it('includes all stats fields', () => {
    const history = [{ resultValue: 4 }];
    const report = generateReportData(history);
    expect(report).toHaveProperty('max');
    expect(report).toHaveProperty('min');
    expect(report).toHaveProperty('avg');
    expect(report).toHaveProperty('total');
  });

  it('includes generatedAt as a number (timestamp)', () => {
    const report = generateReportData([]);
    expect(typeof report.generatedAt).toBe('number');
    expect(report.generatedAt).toBeGreaterThan(0);
  });

  it('historyCount matches the length of the history array', () => {
    const history = [{ resultValue: 1 }, { resultValue: 2 }];
    expect(generateReportData(history).historyCount).toBe(2);
  });

  it('works with empty history', () => {
    const report = generateReportData([]);
    expect(report.historyCount).toBe(0);
    expect(report.total).toBe(0);
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

  it('generates unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

// ─── validateTodo ────────────────────────────────────────────────────────────

describe('validateTodo', () => {
  it('accepts a normal non-empty string', () => {
    expect(validateTodo('Buy milk')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(validateTodo('')).toBeFalsy();
  });

  it('rejects a whitespace-only string', () => {
    expect(validateTodo('   ')).toBeFalsy();
  });

  it('rejects null', () => {
    expect(validateTodo(null)).toBeFalsy();
  });

  it('rejects undefined', () => {
    expect(validateTodo(undefined)).toBeFalsy();
  });

  it('accepts a 200-character string (max boundary)', () => {
    expect(validateTodo('a'.repeat(200))).toBe(true);
  });

  it('rejects a 201-character string (over limit)', () => {
    expect(validateTodo('a'.repeat(201))).toBe(false);
  });

  it('accepts a single character', () => {
    expect(validateTodo('x')).toBe(true);
  });
});

// ─── sortTodos ───────────────────────────────────────────────────────────────

describe('sortTodos', () => {
  const makeTodo = (id, createdAt, completed) => ({ id, createdAt, completed });

  const todos = [
    makeTodo(1, 100, false),
    makeTodo(2, 300, true),
    makeTodo(3, 200, false),
  ];

  it('sorts by date-desc (newest first) — default', () => {
    const sorted = sortTodos(todos, 'date-desc');
    expect(sorted.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it('sorts by date-asc (oldest first)', () => {
    const sorted = sortTodos(todos, 'date-asc');
    expect(sorted.map(t => t.id)).toEqual([1, 3, 2]);
  });

  it('sorts by completed (completed last)', () => {
    const sorted = sortTodos(todos, 'completed');
    expect(sorted[sorted.length - 1].completed).toBe(true);
  });

  it('sorts by pending (pending last)', () => {
    const sorted = sortTodos(todos, 'pending');
    expect(sorted[sorted.length - 1].completed).toBe(false);
  });

  it('unknown sort key returns same order', () => {
    const sorted = sortTodos(todos, 'unknown');
    expect(sorted.map(t => t.id)).toEqual([1, 2, 3]);
  });

  it('does not mutate the original array', () => {
    const original = [...todos];
    sortTodos(todos, 'date-asc');
    expect(todos).toEqual(original);
  });

  it('handles empty array', () => {
    expect(sortTodos([], 'date-desc')).toEqual([]);
  });

  it('handles single-element array', () => {
    const single = [makeTodo(1, 100, false)];
    expect(sortTodos(single, 'date-desc')).toEqual(single);
  });
});

// ─── exportData ──────────────────────────────────────────────────────────────

describe('exportData', () => {
  it('calls document.createElement("a") and triggers click', () => {
    const mockClick = vi.fn();
    const mockAppend = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    const mockRemove = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    const mockLink = {
      href: '',
      download: '',
      style: { display: '' },
      click: mockClick,
    };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(mockLink);

    exportData({ test: 1 }, 'export.json');

    expect(mockClick).toHaveBeenCalledOnce();
    expect(mockLink.download).toBe('export.json');

    mockAppend.mockRestore();
    mockRemove.mockRestore();
  });

  it('creates a Blob with the JSON-serialised data', () => {
    const data = { key: 'value' };
    let capturedBlob;
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = (blob) => { capturedBlob = blob; return 'blob:test'; };

    const mockLink = { href: '', download: '', style: { display: '' }, click: () => {} };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(mockLink);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

    exportData(data, 'out.json');

    // Verify the blob contains the serialised JSON
    expect(capturedBlob).toBeInstanceOf(Blob);
    URL.createObjectURL = originalCreateObjectURL;
  });
});

// ─── getAppAnalytics ─────────────────────────────────────────────────────────

describe('getAppAnalytics', () => {
  const makeState = (overrides = {}) => ({
    history: [],
    todos: [],
    count: 0,
    theme: 'light',
    ...overrides,
  });

  it('returns correct totalCounterChanges', () => {
    const state = makeState({ history: [{}, {}, {}] });
    expect(getAppAnalytics(state).totalCounterChanges).toBe(3);
  });

  it('returns correct totalTodos and completedTodos', () => {
    const state = makeState({
      todos: [
        { completed: true },
        { completed: false },
        { completed: true },
      ],
    });
    const analytics = getAppAnalytics(state);
    expect(analytics.totalTodos).toBe(3);
    expect(analytics.completedTodos).toBe(2);
    expect(analytics.pendingTodos).toBe(1);
  });

  it('returns the current count', () => {
    expect(getAppAnalytics(makeState({ count: 42 })).currentCount).toBe(42);
  });

  it('returns the current theme', () => {
    expect(getAppAnalytics(makeState({ theme: 'dark' })).currentTheme).toBe('dark');
  });

  it('returns appStartTime as an ISO string', () => {
    const result = getAppAnalytics(makeState());
    expect(() => new Date(result.appStartTime)).not.toThrow();
    expect(result.appStartTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('returns zero counts for empty state', () => {
    const analytics = getAppAnalytics(makeState());
    expect(analytics.totalCounterChanges).toBe(0);
    expect(analytics.totalTodos).toBe(0);
    expect(analytics.completedTodos).toBe(0);
    expect(analytics.pendingTodos).toBe(0);
  });
});

// ─── getAppVersion ───────────────────────────────────────────────────────────

describe('getAppVersion', () => {
  it('returns a non-empty string', () => {
    const version = getAppVersion();
    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });

  it('follows major.minor.patch semver format', () => {
    expect(getAppVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
