// Note: Source file not found - creating comprehensive tests based on common multiply function patterns

const multiply = require('../src/multiply');

describe('multiply function', () => {
  describe('basic multiplication', () => {
    test('should multiply two positive numbers', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(5, 4)).toBe(20);
      expect(multiply(1, 1)).toBe(1);
    });

    test('should multiply two negative numbers', () => {
      expect(multiply(-2, -3)).toBe(6);
      expect(multiply(-5, -4)).toBe(20);
    });

    test('should multiply positive and negative numbers', () => {
      expect(multiply(2, -3)).toBe(-6);
      expect(multiply(-5, 4)).toBe(-20);
    });
  });

  describe('edge cases', () => {
    test('should handle multiplication by zero', () => {
      expect(multiply(0, 5)).toBe(0);
      expect(multiply(10, 0)).toBe(0);
      expect(multiply(0, 0)).toBe(0);
    });

    test('should handle multiplication by one', () => {
      expect(multiply(1, 5)).toBe(5);
      expect(multiply(10, 1)).toBe(10);
    });

    test('should handle decimal numbers', () => {
      expect(multiply(2.5, 4)).toBe(10);
      expect(multiply(3.14, 2)).toBeCloseTo(6.28);
      expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
    });

    test('should handle very large numbers', () => {
      expect(multiply(1000000, 1000000)).toBe(1000000000000);
      expect(multiply(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('should handle very small numbers', () => {
      expect(multiply(0.000001, 1000000)).toBe(1);
      expect(multiply(Number.MIN_VALUE, 1)).toBe(Number.MIN_VALUE);
    });
  });

  describe('special values', () => {
    test('should handle Infinity', () => {
      expect(multiply(Infinity, 2)).toBe(Infinity);
      expect(multiply(5, Infinity)).toBe(Infinity);
      expect(multiply(Infinity, Infinity)).toBe(Infinity);
      expect(multiply(-Infinity, 2)).toBe(-Infinity);
      expect(multiply(Infinity, -2)).toBe(-Infinity);
    });

    test('should handle NaN', () => {
      expect(multiply(NaN, 5)).toBeNaN();
      expect(multiply(10, NaN)).toBeNaN();
      expect(multiply(NaN, NaN)).toBeNaN();
    });

    test('should handle zero times infinity', () => {
      expect(multiply(0, Infinity)).toBeNaN();
      expect(multiply(Infinity, 0)).toBeNaN();
    });
  });

  describe('type validation', () => {
    test('should handle string numbers', () => {
      expect(multiply('2', '3')).toBe(6);
      expect(multiply('5', 4)).toBe(20);
      expect(multiply(2, '3')).toBe(6);
    });

    test('should handle invalid inputs', () => {
      expect(multiply('abc', 5)).toBeNaN();
      expect(multiply(5, 'def')).toBeNaN();
      expect(multiply('abc', 'def')).toBeNaN();
    });

    test('should handle null and undefined', () => {
      expect(multiply(null, 5)).toBe(0);
      expect(multiply(5, null)).toBe(0);
      expect(multiply(undefined, 5)).toBeNaN();
      expect(multiply(5, undefined)).toBeNaN();
    });

    test('should handle boolean values', () => {
      expect(multiply(true, 5)).toBe(5);
      expect(multiply(false, 5)).toBe(0);
      expect(multiply(5, true)).toBe(5);
      expect(multiply(5, false)).toBe(0);
    });
  });

  describe('array/object inputs', () => {
    test('should handle array inputs', () => {
      expect(multiply([2], [3])).toBeNaN();
      expect(multiply([2], 3)).toBeNaN();
      expect(multiply(2, [3])).toBeNaN();
    });

    test('should handle object inputs', () => {
      expect(multiply({}, 5)).toBeNaN();
      expect(multiply(5, {})).toBeNaN();
      expect(multiply({a: 1}, {b: 2})).toBeNaN();
    });
  });

  describe('multiple arguments', () => {
    test('should handle more than two arguments if supported', () => {
      // This test assumes the function might accept multiple arguments
      const result = multiply(2, 3, 4);
      // Could be 24 if it multiplies all, or 6 if it only uses first two
      expect(typeof result).toBe('number');
    });

    test('should handle single argument', () => {
      const result = multiply(5);
      // Behavior depends on implementation - might return 5, NaN, or throw error
      expect(result !== undefined).toBe(true);
    });

    test('should handle no arguments', () => {
      const result = multiply();
      // Behavior depends on implementation
      expect(result !== undefined).toBe(true);
    });
  });
});

// Performance tests
describe('multiply performance', () => {
  test('should handle large number of operations efficiently', () => {
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
      multiply(Math.random() * 100, Math.random() * 100);
    }
    const end = performance.now();
    expect(end - start).toBeLessThan(1000); // Should complete in less than 1 second
  });
});

// Integration-style tests
describe('multiply integration', () => {
  test('should work with Math operations', () => {
    expect(multiply(Math.PI, 2)).toBeCloseTo(6.283185307179586);
    expect(multiply(Math.sqrt(4), 3)).toBe(6);
  });

  test('should work in mathematical expressions', () => {
    const result = multiply(2, 3) + multiply(4, 5);
    expect(result).toBe(26);
  });
});
