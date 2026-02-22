import { describe, it, expect } from "vitest";
import { addTwoNumbers } from "./two_sum.js";

describe("addTwoNumbers", () => {
  it("returns the sum of two positive integers", () => {
    expect(addTwoNumbers(5, 7)).toBe(12);
  });

  it("returns the sum of two negative numbers", () => {
    expect(addTwoNumbers(-3, -4)).toBe(-7);
  });

  it("returns the sum of a positive and a negative number", () => {
    expect(addTwoNumbers(10, -4)).toBe(6);
  });

  it("returns zero when both arguments are zero", () => {
    expect(addTwoNumbers(0, 0)).toBe(0);
  });

  it("returns the correct sum when one argument is zero", () => {
    expect(addTwoNumbers(0, 5)).toBe(5);
    expect(addTwoNumbers(5, 0)).toBe(5);
  });

  it("handles floating-point numbers", () => {
    expect(addTwoNumbers(1.5, 2.5)).toBeCloseTo(4.0);
  });

  it("handles large numbers", () => {
    expect(addTwoNumbers(1_000_000, 2_000_000)).toBe(3_000_000);
  });
});
