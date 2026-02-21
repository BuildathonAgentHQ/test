const multiply = require('../src/multiply');

describe('multiply function', () => {
  // Basic multiplication tests
  test('should multiply two positive integers', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(5, 6)).toBe(30);
    expect(multiply(1, 1)).toBe(1);
  });

  test('should multiply two negative integers', () => {
    expect(multiply(-3, -4)).toBe(12);
    expect(multiply(-5, -6)).toBe(30);
    expect(multiply(-1, -1)).toBe(1);
  });

  test('should multiply positive and negative integers', () => {
    expect(multiply(3, -4)).toBe(-12);
    expect(multiply(-3, 4)).toBe(-12);
    expect(multiply(5, -2)).toBe(-10);
  });

  test('should handle multiplication with zero', () => {
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(5, 0)).toBe(0);
    expect(multiply(0, 0)).toBe(0);
    expect(multiply(-5, 0)).toBe(0);
    expect(multiply(0, -5)).toBe(0);
  });

  test('should handle multiplication with one', () => {
    expect(multiply(1, 5)).toBe(5);
    expect(multiply(5, 1)).toBe(5);
    expect(multiply(1, -5)).toBe(-5);
    expect(multiply(-5, 1)).toBe(-5);
  });

  // Floating point tests
  test('should multiply floating point numbers', () => {
    expect(multiply(2.5, 4)).toBe(10);
    expect(multiply(3.14, 2)).toBeCloseTo(6.28);
    expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
    expect(multiply(-2.5, 3.2)).toBeCloseTo(-8);
  });

  // Large number tests
  test('should handle large numbers', () => {
    expect(multiply(1000000, 1000)).toBe(1000000000);
    expect(multiply(999999, 999999)).toBe(999998000001);
  });

  // Edge cases and error conditions
  test('should handle undefined inputs', () => {
    expect(multiply(undefined, 5)).toBeNaN();
    expect(multiply(5, undefined)).toBeNaN();
    expect(multiply(undefined, undefined)).toBeNaN();
  });

  test('should handle null inputs', () => {
    expect(multiply(null, 5)).toBe(0);
    expect(multiply(5, null)).toBe(0);
    expect(multiply(null, null)).toBe(0);
  });

  test('should handle string inputs', () => {
    expect(multiply('5', '3')).toBe(15);
    expect(multiply('5', 3)).toBe(15);
    expect(multiply(5, '3')).toBe(15);
    expect(multiply('abc', 5)).toBeNaN();
    expect(multiply(5, 'xyz')).toBeNaN();
    expect(multiply('', 5)).toBe(0);
  });

  test('should handle boolean inputs', () => {
    expect(multiply(true, 5)).toBe(5);
    expect(multiply(false, 5)).toBe(0);
    expect(multiply(5, true)).toBe(5);
    expect(multiply(5, false)).toBe(0);
    expect(multiply(true, true)).toBe(1);
    expect(multiply(false, false)).toBe(0);
  });

  test('should handle Infinity', () => {
    expect(multiply(Infinity, 5)).toBe(Infinity);
    expect(multiply(5, Infinity)).toBe(Infinity);
    expect(multiply(Infinity, Infinity)).toBe(Infinity);
    expect(multiply(-Infinity, 5)).toBe(-Infinity);
    expect(multiply(Infinity, -5)).toBe(-Infinity);
    expect(multiply(Infinity, 0)).toBeNaN();
  });

  test('should handle NaN inputs', () => {
    expect(multiply(NaN, 5)).toBeNaN();
    expect(multiply(5, NaN)).toBeNaN();
    expect(multiply(NaN, NaN)).toBeNaN();
  });

  test('should handle array inputs', () => {
    expect(multiply([5], [3])).toBe(15);
    expect(multiply([5, 2], 3)).toBeNaN();
    expect(multiply([], 5)).toBe(0);
  });

  test('should handle object inputs', () => {
    expect(multiply({}, 5)).toBeNaN();
    expect(multiply(5, {})).toBeNaN();
    expect(multiply({valueOf: () => 5}, 3)).toBe(15);
  });

  test('should handle no arguments', () => {
    expect(multiply()).toBeNaN();
  });

  test('should handle single argument', () => {
    expect(multiply(5)).toBeNaN();
  });

  test('should handle more than two arguments', () => {
    expect(multiply(2, 3, 4)).toBe(6); // Should only use first two
  });

  // Precision tests
  test('should maintain precision for decimal multiplication', () => {
    expect(multiply(0.1, 3)).toBeCloseTo(0.3);
    expect(multiply(0.2, 0.2)).toBeCloseTo(0.04);
    expect(multiply(1.1, 1.1)).toBeCloseTo(1.21);
  });

  // Negative zero tests
  test('should handle negative zero', () => {
    expect(multiply(-0, 5)).toBe(-0);
    expect(multiply(5, -0)).toBe(-0);
    expect(Object.is(multiply(-0, 5), -0)).toBe(true);
  });
});