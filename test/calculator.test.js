const Calculator = require('../src/calculator');

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add two negative numbers', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    test('should add positive and negative numbers', () => {
      expect(calculator.add(5, -3)).toBe(2);
    });

    test('should add zero', () => {
      expect(calculator.add(5, 0)).toBe(5);
      expect(calculator.add(0, 0)).toBe(0);
    });

    test('should add decimal numbers', () => {
      expect(calculator.add(0.1, 0.2)).toBeCloseTo(0.3);
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.add('a', 2)).toThrow('Invalid input: arguments must be numbers');
      expect(() => calculator.add(2, null)).toThrow('Invalid input: arguments must be numbers');
      expect(() => calculator.add(undefined, 2)).toThrow('Invalid input: arguments must be numbers');
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    test('should subtract negative numbers', () => {
      expect(calculator.subtract(-5, -3)).toBe(-2);
      expect(calculator.subtract(5, -3)).toBe(8);
    });

    test('should subtract zero', () => {
      expect(calculator.subtract(5, 0)).toBe(5);
      expect(calculator.subtract(0, 5)).toBe(-5);
    });

    test('should subtract decimal numbers', () => {
      expect(calculator.subtract(0.3, 0.1)).toBeCloseTo(0.2);
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.subtract('a', 2)).toThrow('Invalid input: arguments must be numbers');
      expect(() => calculator.subtract(2, {})).toThrow('Invalid input: arguments must be numbers');
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
    });

    test('should multiply negative numbers', () => {
      expect(calculator.multiply(-3, 4)).toBe(-12);
      expect(calculator.multiply(-3, -4)).toBe(12);
    });

    test('should multiply by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
      expect(calculator.multiply(0, 0)).toBe(0);
    });

    test('should multiply decimal numbers', () => {
      expect(calculator.multiply(0.2, 0.3)).toBeCloseTo(0.06);
    });

    test('should multiply by one', () => {
      expect(calculator.multiply(7, 1)).toBe(7);
      expect(calculator.multiply(1, 7)).toBe(7);
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.multiply('a', 2)).toThrow('Invalid input: arguments must be numbers');
      expect(() => calculator.multiply(2, [])).toThrow('Invalid input: arguments must be numbers');
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    test('should divide negative numbers', () => {
      expect(calculator.divide(-10, 2)).toBe(-5);
      expect(calculator.divide(-10, -2)).toBe(5);
    });

    test('should divide decimal numbers', () => {
      expect(calculator.divide(0.6, 0.2)).toBeCloseTo(3);
    });

    test('should divide by one', () => {
      expect(calculator.divide(7, 1)).toBe(7);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Division by zero is not allowed');
      expect(() => calculator.divide(-5, 0)).toThrow('Division by zero is not allowed');
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.divide('a', 2)).toThrow('Invalid input: arguments must be numbers');
      expect(() => calculator.divide(2, 'b')).toThrow('Invalid input: arguments must be numbers');
    });
  });

  describe('power', () => {
    test('should calculate power of positive numbers', () => {
      expect(calculator.power(2, 3)).toBe(8);
      expect(calculator.power(5, 2)).toBe(25);
    });

    test('should calculate power with zero exponent', () => {
      expect(calculator.power(5, 0)).toBe(1);
      expect(calculator.power(0, 0)).toBe(1);
    });

    test('should calculate power with negative exponent', () => {
      expect(calculator.power(2, -2)).toBeCloseTo(0.25);
    });

    test('should calculate power with decimal numbers', () => {
      expect(calculator.power(4, 0.5)).toBeCloseTo(2);
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.power('a', 2)).toThrow('Invalid input: arguments must be numbers');
      expect(() => calculator.power(2, 'b')).toThrow('Invalid input: arguments must be numbers');
    });
  });

  describe('sqrt', () => {
    test('should calculate square root of positive numbers', () => {
      expect(calculator.sqrt(4)).toBe(2);
      expect(calculator.sqrt(9)).toBe(3);
      expect(calculator.sqrt(16)).toBe(4);
    });

    test('should calculate square root of zero', () => {
      expect(calculator.sqrt(0)).toBe(0);
    });

    test('should calculate square root of decimal numbers', () => {
      expect(calculator.sqrt(0.25)).toBeCloseTo(0.5);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.sqrt(-4)).toThrow('Cannot calculate square root of negative number');
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.sqrt('a')).toThrow('Invalid input: argument must be a number');
      expect(() => calculator.sqrt(null)).toThrow('Invalid input: argument must be a number');
    });
  });

  describe('factorial', () => {
    test('should calculate factorial of positive integers', () => {
      expect(calculator.factorial(0)).toBe(1);
      expect(calculator.factorial(1)).toBe(1);
      expect(calculator.factorial(5)).toBe(120);
      expect(calculator.factorial(6)).toBe(720);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.factorial(-1)).toThrow('Factorial is not defined for negative numbers');
    });

    test('should throw error for non-integers', () => {
      expect(() => calculator.factorial(3.5)).toThrow('Factorial is only defined for non-negative integers');
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.factorial('a')).toThrow('Invalid input: argument must be a number');
    });
  });

  describe('percentage', () => {
    test('should calculate percentage correctly', () => {
      expect(calculator.percentage(50, 200)).toBe(25);
      expect(calculator.percentage(25, 100)).toBe(25);
    });

    test('should handle zero values', () => {
      expect(calculator.percentage(0, 100)).toBe(0);
    });

    test('should throw error when total is zero', () => {
      expect(() => calculator.percentage(50, 0)).toThrow('Cannot calculate percentage when total is zero');
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.percentage('a', 100)).toThrow('Invalid input: arguments must be numbers');
    });
  });

  describe('clear', () => {
    test('should reset calculator state', () => {
      calculator.memory = 10;
      calculator.clear();
      expect(calculator.memory).toBe(0);
    });
  });

  describe('memory operations', () => {
    test('should store value in memory', () => {
      calculator.memoryStore(15);
      expect(calculator.memoryRecall()).toBe(15);
    });

    test('should add to memory', () => {
      calculator.memoryStore(10);
      calculator.memoryAdd(5);
      expect(calculator.memoryRecall()).toBe(15);
    });

    test('should subtract from memory', () => {
      calculator.memoryStore(10);
      calculator.memorySubtract(3);
      expect(calculator.memoryRecall()).toBe(7);
    });

    test('should clear memory', () => {
      calculator.memoryStore(10);
      calculator.memoryClear();
      expect(calculator.memoryRecall()).toBe(0);
    });
  });
});