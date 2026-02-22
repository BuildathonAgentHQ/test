/**
 * Adds two numbers and returns the result.
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
function addTwoNumbers(a, b) {
  return a + b;
}

// Example usage
const num1 = 5;
const num2 = 7;
const result = addTwoNumbers(num1, num2);
console.log(`${num1} + ${num2} = ${result}`);

export { addTwoNumbers };
