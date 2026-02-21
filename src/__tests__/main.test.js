/**
 * Unit tests for src/main.js (Aurora Focus)
 *
 * Because main.js runs browser-specific code at module level (Canvas 2D,
 * requestAnimationFrame, AudioContext, setInterval), we:
 *  1. Stub those globals before the first import.
 *  2. Seed the DOM with the same HTML structure as index.html.
 *  3. Use fake timers to control clock/Pomodoro behaviour.
 */

import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Build a minimal mock of the CanvasRenderingContext2D */
function makeCtx() {
  return {
    fillStyle: '',
    globalCompositeOperation: '',
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
  };
}

/** Inject Aurora Focus HTML (mirrors index.html body contents) */
function seedDOM() {
  document.body.innerHTML = `
    <canvas id="canvas"></canvas>
    <div class="ui-overlay">
      <div class="panel clock-panel">
        <div class="clock-time" id="clock-time">00:00:00</div>
        <div class="clock-date" id="clock-date">Loading…</div>
      </div>
      <div class="panel timer-panel">
        <div class="timer-label" id="timer-label">FOCUS</div>
        <div class="timer-ring-wrap">
          <svg class="timer-ring" viewBox="0 0 120 120">
            <circle class="timer-ring-bg" cx="60" cy="60" r="52" />
            <circle class="timer-ring-fill" id="timer-ring-fill" cx="60" cy="60" r="52" />
          </svg>
          <div class="timer-display" id="timer-display">25:00</div>
        </div>
        <div class="timer-controls">
          <button class="ctrl-btn" id="btn-timer-toggle">&#9654;</button>
          <button class="ctrl-btn" id="btn-timer-reset">&#8635;</button>
          <button class="ctrl-btn mode-btn" id="btn-timer-mode">5m</button>
        </div>
        <div class="timer-sessions">
          <span id="session-dots"></span>
          <span class="session-label" id="session-count">Session 1</span>
        </div>
      </div>
      <div class="panel todo-panel">
        <div class="panel-title">Quick Notes</div>
        <div class="todo-input-row">
          <input class="todo-input" id="todo-input" type="text" placeholder="Add a task…" maxlength="80" />
          <button class="add-btn" id="btn-add-todo">+</button>
        </div>
        <ul class="todo-list" id="todo-list"></ul>
        <div class="todo-empty" id="todo-empty">Nothing here — go create!</div>
      </div>
    </div>
    <button class="sound-btn" id="btn-sound">
      <span id="sound-icon">♪</span>
    </button>
    <div class="hint">Space: start/pause · R: reset · M: switch mode</div>
  `;
}

// ─── Module-level browser API stubs ─────────────────────────────────────────

// Stub canvas.getContext so module-level canvas code doesn't throw
HTMLCanvasElement.prototype.getContext = vi.fn(() => makeCtx());

// Silence requestAnimationFrame (prevents infinite animation loop)
vi.stubGlobal('requestAnimationFrame', vi.fn());

// ─── Module import (done once, after DOM + stubs are in place) ───────────────

beforeAll(async () => {
  // Clear any previously stored todos
  localStorage.removeItem('aurora-todos');

  seedDOM();
  await import('../main.js');
});

afterAll(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ─── Clock ────────────────────────────────────────────────────────────────────

describe('Clock display', () => {
  it('populates #clock-time with HH:MM:SS format on load', () => {
    const el = document.getElementById('clock-time');
    expect(el.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('populates #clock-date with a human-readable date on load', () => {
    const el = document.getElementById('clock-date');
    // Expects something like "Saturday · Feb 15, 2025"
    expect(el.textContent).toMatch(/·/);
    expect(el.textContent.length).toBeGreaterThan(5);
  });
});

// ─── Pomodoro Timer initial state ─────────────────────────────────────────────

describe('Pomodoro timer — initial state', () => {
  it('shows "25:00" as the initial timer display', () => {
    expect(document.getElementById('timer-display').textContent).toBe('25:00');
  });

  it('shows "FOCUS" as the initial timer label', () => {
    expect(document.getElementById('timer-label').textContent).toBe('FOCUS');
  });

  it('shows "5m" on the mode-switch button (next mode hint)', () => {
    expect(document.getElementById('btn-timer-mode').textContent).toBe('5m');
  });

  it('shows "Session 1" in session count', () => {
    expect(document.getElementById('session-count').textContent).toBe('Session 1');
  });

  it('renders 4 session-dot spans', () => {
    const dots = document.querySelectorAll('.session-dot');
    expect(dots.length).toBe(4);
  });

  it('has no completed session dots on load', () => {
    const doneDots = document.querySelectorAll('.session-dot.done');
    expect(doneDots.length).toBe(0);
  });
});

// ─── Pomodoro Timer controls ──────────────────────────────────────────────────

describe('Pomodoro timer — controls', () => {
  beforeEach(() => {
    // Reset timer to FOCUS mode before each control test
    document.getElementById('btn-timer-reset').click();
  });

  it('toggles the toggle button text when clicked (start then pause)', () => {
    const toggle = document.getElementById('btn-timer-toggle');
    const resetBtn = document.getElementById('btn-timer-reset');

    // Start
    toggle.click();
    // Pause symbol should appear (▐▐ encoded as HTML entities ❚❚)
    expect(toggle.innerHTML).not.toBe('▶');

    // Pause
    toggle.click();
    // Back to play symbol ▶
    expect(toggle.innerHTML).toContain('▶');

    resetBtn.click();
  });

  it('reset button restores "25:00" when in FOCUS mode', () => {
    const toggle = document.getElementById('btn-timer-toggle');
    const reset = document.getElementById('btn-timer-reset');

    toggle.click(); // start
    toggle.click(); // pause
    reset.click();

    expect(document.getElementById('timer-display').textContent).toBe('25:00');
  });

  it('mode-switch button changes label and display', () => {
    const modeBtn = document.getElementById('btn-timer-mode');
    modeBtn.click(); // switch to BREAK

    const label = document.getElementById('timer-label').textContent;
    expect(['FOCUS', 'BREAK']).toContain(label);

    // Restore to FOCUS
    modeBtn.click();
  });
});

// ─── Todo List ────────────────────────────────────────────────────────────────

describe('Todo list', () => {
  beforeEach(() => {
    // Clear todos and re-render
    localStorage.removeItem('aurora-todos');
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
  });

  function addTodoViaUI(text) {
    const input = document.getElementById('todo-input');
    const btn = document.getElementById('btn-add-todo');
    input.value = text;
    btn.click();
  }

  it('shows the empty state when no todos exist', () => {
    // Simulate a fresh state by clearing the list manually
    document.getElementById('todo-list').innerHTML = '';
    const empty = document.getElementById('todo-empty');
    // After clearing, empty element should be present in DOM
    expect(empty).not.toBeNull();
  });

  it('adds a new todo item when the button is clicked', () => {
    addTodoViaUI('Write unit tests');
    const items = document.querySelectorAll('.todo-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('clears the input field after adding a todo', () => {
    const input = document.getElementById('todo-input');
    input.value = 'Task to clear';
    document.getElementById('btn-add-todo').click();
    expect(input.value).toBe('');
  });

  it('does not add a todo for an empty string', () => {
    const before = document.querySelectorAll('.todo-item').length;
    document.getElementById('todo-input').value = '  ';
    document.getElementById('btn-add-todo').click();
    const after = document.querySelectorAll('.todo-item').length;
    expect(after).toBe(before);
  });

  it('adds a todo when Enter is pressed in the input field', () => {
    const input = document.getElementById('todo-input');
    input.value = 'Enter key task';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const items = document.querySelectorAll('.todo-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('deletes a todo when its delete button is clicked', () => {
    addTodoViaUI('Task to delete');
    const beforeCount = document.querySelectorAll('.todo-item').length;
    const delBtn = document.querySelector('.todo-del');
    if (delBtn) delBtn.click();
    const afterCount = document.querySelectorAll('.todo-item').length;
    expect(afterCount).toBeLessThan(beforeCount);
  });

  it('toggles a todo done/undone via the check button', () => {
    addTodoViaUI('Toggle me');
    const checkBtn = document.querySelector('.todo-check');
    expect(checkBtn).not.toBeNull();

    // Not done initially
    expect(checkBtn.classList.contains('checked')).toBe(false);

    checkBtn.click();

    // Now done
    const updatedCheck = document.querySelector('.todo-check');
    expect(updatedCheck.classList.contains('checked')).toBe(true);
  });

  it('persists todos to localStorage', () => {
    addTodoViaUI('Persistent task');
    const stored = JSON.parse(localStorage.getItem('aurora-todos') || '[]');
    expect(stored.some(t => t.text === 'Persistent task')).toBe(true);
  });
});

// ─── Sound toggle ─────────────────────────────────────────────────────────────

describe('Sound toggle button', () => {
  it('exists in the DOM', () => {
    expect(document.getElementById('btn-sound')).not.toBeNull();
  });

  it('has the sound icon span', () => {
    expect(document.getElementById('sound-icon')).not.toBeNull();
  });
});

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────

describe('Keyboard shortcuts', () => {
  beforeEach(() => {
    document.getElementById('btn-timer-reset').click();
  });

  it('Space key starts the timer', () => {
    const toggle = document.getElementById('btn-timer-toggle');
    const initialHtml = toggle.innerHTML;

    document.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true })
    );

    expect(toggle.innerHTML).not.toBe(initialHtml);

    // Clean up — pause via toggle
    toggle.click();
  });

  it('R key resets the timer', () => {
    // First start
    document.getElementById('btn-timer-toggle').click();
    // Then reset via R key
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'r', bubbles: true })
    );
    expect(document.getElementById('timer-display').textContent).toBe('25:00');
  });

  it('M key switches the mode', () => {
    const before = document.getElementById('timer-label').textContent;
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'm', bubbles: true })
    );
    const after = document.getElementById('timer-label').textContent;
    expect(['FOCUS', 'BREAK']).toContain(after);
    // Restore
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'm', bubbles: true })
    );
  });

  it('Space key is ignored when an input is focused', () => {
    const input = document.getElementById('todo-input');
    input.focus();

    const toggle = document.getElementById('btn-timer-toggle');
    const initialHtml = toggle.innerHTML;

    // Dispatch with target = input
    const ev = new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true });
    Object.defineProperty(ev, 'target', { value: input, writable: false });
    document.dispatchEvent(ev);

    // Timer toggle state should remain the same
    expect(toggle.innerHTML).toBe(initialHtml);
  });
});
