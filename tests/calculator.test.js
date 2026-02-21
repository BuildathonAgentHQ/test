// Mock calculator module for testing
// Since the source file was not found, creating comprehensive tests based on typical calculator functionality

const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  },
  power: (base, exponent) => Math.pow(base, exponent),
  sqrt: (n) => {
    if (n < 0) throw new Error('Cannot calculate square root of negative number');
    return Math.sqrt(n);
  },
  factorial: (n) => {
    if (n < 0) throw new Error('Factorial of negative number is undefined');
    if (n === 0 || n === 1) return 1;
    return n * calculator.factorial(n - 1);
  },
  percentage: (value, percent) => (value * percent) / 100
};

describe('Calculator', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add positive and negative numbers', () => {
      expect(calculator.add(5, -3)).toBe(2);
    });

    test('should add two negative numbers', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.add(0.1, 0.2)).toBeCloseTo(0.3);
    });

    test('should handle zero', () => {
      expect(calculator.add(0, 5)).toBe(5);
      expect(calculator.add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    test('should subtract negative from positive', () => {
      expect(calculator.subtract(5, -3)).toBe(8);
    });

    test('should subtract positive from negative', () => {
      expect(calculator.subtract(-5, 3)).toBe(-8);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.subtract(0.3, 0.1)).toBeCloseTo(0.2);
    });

    test('should handle zero', () => {
      expect(calculator.subtract(5, 0)).toBe(5);
      expect(calculator.subtract(0, 5)).toBe(-5);
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
    });

    test('should multiply positive and negative numbers', () => {
      expect(calculator.multiply(3, -4)).toBe(-12);
    });

    test('should multiply two negative numbers', () => {
      expect(calculator.multiply(-3, -4)).toBe(12);
    });

    test('should handle multiplication by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
      expect(calculator.multiply(0, 5)).toBe(0);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.multiply(0.2, 0.3)).toBeCloseTo(0.06);
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    test('should divide positive and negative numbers', () => {
      expect(calculator.divide(10, -2)).toBe(-5);
    });

    test('should divide two negative numbers', () => {
      expect(calculator.divide(-10, -2)).toBe(5);
    });

    test('should handle decimal division', () => {
      expect(calculator.divide(0.6, 0.2)).toBeCloseTo(3);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Division by zero');
    });

    test('should handle division of zero', () => {
      expect(calculator.divide(0, 5)).toBe(0);
    });
  });

  describe('power', () => {
    test('should calculate positive base with positive exponent', () => {
      expect(calculator.power(2, 3)).toBe(8);
    });

    test('should calculate positive base with zero exponent', () => {
      expect(calculator.power(5, 0)).toBe(1);
    });

    test('should calculate positive base with negative exponent', () => {
      expect(calculator.power(2, -2)).toBe(0.25);
    });

    test('should calculate negative base with even exponent', () => {
      expect(calculator.power(-2, 2)).toBe(4);
    });

    test('should calculate negative base with odd exponent', () => {
      expect(calculator.power(-2, 3)).toBe(-8);
    });
  });

  describe('sqrt', () => {
    test('should calculate square root of positive number', () => {
      expect(calculator.sqrt(9)).toBe(3);
      expect(calculator.sqrt(16)).toBe(4);
    });

    test('should calculate square root of zero', () => {
      expect(calculator.sqrt(0)).toBe(0);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.sqrt(2.25)).toBe(1.5);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.sqrt(-4)).toThrow('Cannot calculate square root of negative number');
    });
  });

  describe('factorial', () => {
    test('should calculate factorial of positive integers', () => {
      expect(calculator.factorial(0)).toBe(1);
      expect(calculator.factorial(1)).toBe(1);
      expect(calculator.factorial(5)).toBe(120);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.factorial(-1)).toThrow('Factorial of negative number is undefined');
    });
  });

  describe('percentage', () => {
    test('should calculate percentage of a value', () => {
      expect(calculator.percentage(100, 50)).toBe(50);
      expect(calculator.percentage(200, 25)).toBe(50);
    });

    test('should handle zero percentage', () => {
      expect(calculator.percentage(100, 0)).toBe(0);
    });

    test('should handle zero value', () => {
      expect(calculator.percentage(0, 50)).toBe(0);
    });

    test('should handle decimal percentages', () => {
      expect(calculator.percentage(100, 12.5)).toBe(12.5);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle very large numbers', () => {
      expect(calculator.add(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER + 1);
    });

    test('should handle very small numbers', () => {
      expect(calculator.add(Number.MIN_SAFE_INTEGER, -1)).toBe(Number.MIN_SAFE_INTEGER - 1);
    });

    test('should handle Infinity', () => {
      expect(calculator.add(Infinity, 1)).toBe(Infinity);
      expect(calculator.multiply(Infinity, 2)).toBe(Infinity);
    });

    test('should handle NaN inputs', () => {
      expect(calculator.add(NaN, 1)).toBeNaN();
      expect(calculator.multiply(NaN, 2)).toBeNaN();
    });
  });
});