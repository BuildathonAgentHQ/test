/**
 * Pure helper functions extracted from the Aurora Focus main.js (PR #25).
 *
 * Keeping these as side-effect-free functions makes them fully unit-testable
 * without requiring a DOM or browser globals.
 */

// ─── Clock helpers ────────────────────────────────────────────────────────────

export const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Format a Date into "HH:MM:SS".
 * @param {Date} date
 * @returns {string}
 */
export function formatClockTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/**
 * Format a Date into the verbose date line shown below the clock.
 * Example: "Friday · Mar 15, 2024"
 * @param {Date} date
 * @returns {string}
 */
export function formatClockDate(date) {
  return `${DAYS[date.getDay()]} \u00b7 ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ─── Timer helpers ────────────────────────────────────────────────────────────

/** Pomodoro modes configuration (mirrors MODES in main.js). */
export const TIMER_MODES = [
  { label: 'FOCUS', duration: 25 * 60, next: '5m'  },
  { label: 'BREAK', duration:  5 * 60, next: '25m' },
];

export const CIRCUMFERENCE = 327; // 2π × r (r = 52)

/**
 * Format remaining seconds as "MM:SS".
 * @param {number} seconds
 * @returns {string}
 */
export function formatTimerDisplay(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Calculate SVG ring stroke-dashoffset for the given remaining time.
 * @param {number} remaining - seconds remaining
 * @param {number} total     - total seconds in the mode
 * @param {number} circumference - stroke circumference (default CIRCUMFERENCE)
 * @returns {number}
 */
export function computeRingOffset(remaining, total, circumference = CIRCUMFERENCE) {
  const frac = remaining / total;
  return circumference * (1 - frac);
}

/**
 * Advance to the next timer mode index (cyclic).
 * @param {number} currentIdx
 * @param {Array}  modes
 * @returns {number}
 */
export function nextModeIndex(currentIdx, modes) {
  return (currentIdx + 1) % modes.length;
}

/**
 * Build a session-dot state array (4 dots per cycle).
 * @param {number} sessions - total completed focus sessions
 * @returns {boolean[]} array of 4 booleans; true = dot is filled
 */
export function buildSessionDots(sessions) {
  return Array.from({ length: 4 }, (_, i) => i < (sessions % 4));
}

// ─── Todo helpers ─────────────────────────────────────────────────────────────

/**
 * Add a new todo to the front of the list.
 * Returns the original list unchanged if text is blank.
 * @param {Array}  todos
 * @param {string} text
 * @param {number} [id]  - optional id override (useful in tests)
 * @returns {Array}
 */
export function addTodo(todos, text, id = Date.now()) {
  const trimmed = (text || '').trim();
  if (!trimmed) return todos;
  return [{ text: trimmed, done: false, id }, ...todos];
}

/**
 * Toggle the `done` flag on the todo at `idx`.
 * @param {Array}  todos
 * @param {number} idx
 * @returns {Array}
 */
export function toggleTodo(todos, idx) {
  return todos.map((t, i) => (i === idx ? { ...t, done: !t.done } : t));
}

/**
 * Remove the todo at `idx`.
 * @param {Array}  todos
 * @param {number} idx
 * @returns {Array}
 */
export function removeTodo(todos, idx) {
  return todos.filter((_, i) => i !== idx);
}
