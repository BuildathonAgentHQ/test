import { describe, it, expect } from 'vitest';
import { calculateTotal } from './utils.js';

describe('utils', () => {
    it('should calculate total correctly', () => {
        expect(calculateTotal([10, 20])).toBe(30);
    });
});
