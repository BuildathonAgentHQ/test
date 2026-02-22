/**
 * Unit tests for src/main.js
 *
 * main.js is a non-modular vanilla-JS file that ties Canvas, Clock, Pomodoro
 * timer and Todo list together.  We import it once into a carefully-prepared
 * jsdom environment and drive the UI through DOM interactions.
 */

import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';

// ─── Build the HTML skeleton that main.js expects ────────────────────────────

function buildDOM() {
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
            <circle class="timer-ring-bg"   cx="60" cy="60" r="52" />
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

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeAll(async () => {
  vi.useFakeTimers();
  localStorage.clear();
  buildDOM();
  // Dynamically import so the DOM is ready before module-level code runs
  await import('./main.js');
});

afterAll(() => {
  vi.useRealTimers();
  localStorage.clear();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const el = id => document.getElementById(id);
const click = id => el(id).dispatchEvent(new MouseEvent('click', { bubbles: true }));

// ─── Clock ────────────────────────────────────────────────────────────────────

describe('Clock', () => {
  it('renders clock-time in HH:MM:SS format', () => {
    expect(el('clock-time').textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('renders clock-date with a day name and year', () => {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const text = el('clock-date').textContent;
    const containsDay = days.some(d => text.includes(d));
    expect(containsDay).toBe(true);
    expect(text).toMatch(/\d{4}/); // year present
  });

  it('updates the clock display every second', () => {
    const before = el('clock-time').textContent;
    // Advance one minute so at least the seconds field changes
    vi.setSystemTime(new Date(Date.now() + 60_000));
    vi.advanceTimersByTime(1000);
    const after = el('clock-time').textContent;
    expect(after).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(after).not.toBe(before);
    // Restore so other tests are unaffected
    vi.setSystemTime(new Date());
  });
});

// ─── Pomodoro Timer — initial state ──────────────────────────────────────────

describe('Timer — initial state', () => {
  it('shows 25:00 (FOCUS mode duration)', () => {
    expect(el('timer-display').textContent).toBe('25:00');
  });

  it('shows FOCUS as the mode label', () => {
    expect(el('timer-label').textContent).toBe('FOCUS');
  });

  it('shows "5m" as the mode-switch button label', () => {
    expect(el('btn-timer-mode').textContent).toBe('5m');
  });

  it('shows "Session 1" as session count', () => {
    expect(el('session-count').textContent).toBe('Session 1');
  });

  it('renders 4 session dots, none done', () => {
    const dots = el('session-dots').querySelectorAll('.session-dot');
    expect(dots.length).toBe(4);
    dots.forEach(d => expect(d.classList.contains('done')).toBe(false));
  });
});

// ─── Pomodoro Timer — controls ────────────────────────────────────────────────

describe('Timer — start / pause', () => {
  beforeEach(() => {
    // Reset to a clean FOCUS state before each timer test
    click('btn-timer-reset');
    // Make sure we start from FOCUS (switch until label matches)
    while (el('timer-label').textContent !== 'FOCUS') {
      click('btn-timer-mode');
    }
    click('btn-timer-reset');
  });

  it('decrements remaining time by 1 second after one tick when started', () => {
    click('btn-timer-toggle'); // start
    vi.advanceTimersByTime(1000);
    expect(el('timer-display').textContent).toBe('24:59');
    click('btn-timer-toggle'); // pause
  });

  it('stops decrementing when paused', () => {
    click('btn-timer-toggle'); // start
    vi.advanceTimersByTime(2000);
    click('btn-timer-toggle'); // pause
    const frozen = el('timer-display').textContent;
    vi.advanceTimersByTime(3000);
    expect(el('timer-display').textContent).toBe(frozen);
  });

  it('toggle button icon changes on start', () => {
    const before = el('btn-timer-toggle').innerHTML;
    click('btn-timer-toggle'); // start
    expect(el('btn-timer-toggle').innerHTML).not.toBe(before);
    click('btn-timer-toggle'); // pause back
  });
});

describe('Timer — reset', () => {
  it('restores the display to 25:00 after ticking', () => {
    // start and tick a few seconds
    click('btn-timer-toggle');
    vi.advanceTimersByTime(5000);
    click('btn-timer-toggle'); // pause
    click('btn-timer-reset');
    expect(el('timer-display').textContent).toBe('25:00');
  });
});

describe('Timer — mode switch', () => {
  it('switches from FOCUS to BREAK and shows 05:00', () => {
    // Make sure we're in FOCUS first
    while (el('timer-label').textContent !== 'FOCUS') {
      click('btn-timer-mode');
    }
    click('btn-timer-reset');
    click('btn-timer-mode'); // switch to BREAK
    expect(el('timer-label').textContent).toBe('BREAK');
    expect(el('timer-display').textContent).toBe('05:00');
  });

  it('switches back from BREAK to FOCUS', () => {
    while (el('timer-label').textContent !== 'BREAK') {
      click('btn-timer-mode');
    }
    click('btn-timer-mode'); // switch back to FOCUS
    expect(el('timer-label').textContent).toBe('FOCUS');
    expect(el('timer-display').textContent).toBe('25:00');
  });
});

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────

describe('Keyboard shortcuts', () => {
  beforeEach(() => {
    // Ensure FOCUS mode and reset
    while (el('timer-label').textContent !== 'FOCUS') {
      click('btn-timer-mode');
    }
    click('btn-timer-reset');
  });

  it('Space starts/pauses the timer', () => {
    const before = el('timer-display').textContent;
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    vi.advanceTimersByTime(1000);
    expect(el('timer-display').textContent).not.toBe(before);
    // pause with Space
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    const paused = el('timer-display').textContent;
    vi.advanceTimersByTime(2000);
    expect(el('timer-display').textContent).toBe(paused);
  });

  it('R key resets the timer', () => {
    // tick a couple of seconds
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    vi.advanceTimersByTime(3000);
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    // reset via R
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }));
    expect(el('timer-display').textContent).toBe('25:00');
  });

  it('M key switches the mode', () => {
    while (el('timer-label').textContent !== 'FOCUS') {
      click('btn-timer-mode');
    }
    click('btn-timer-reset');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }));
    expect(el('timer-label').textContent).toBe('BREAK');
    // switch back
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }));
  });

  it('ignores Space when an input is focused', () => {
    // Give focus to the todo input
    el('todo-input').focus();
    const before = el('timer-display').textContent;
    el('todo-input').dispatchEvent(
      new KeyboardEvent('keydown', { code: 'Space', target: el('todo-input'), bubbles: true })
    );
    vi.advanceTimersByTime(2000);
    // timer should NOT have started
    expect(el('timer-display').textContent).toBe(before);
    el('todo-input').blur();
  });
});

// ─── Todo list ────────────────────────────────────────────────────────────────

describe('Todo list', () => {
  beforeEach(() => {
    localStorage.clear();
    el('todo-list').innerHTML = '';
    el('todo-input').value = '';
  });

  it('shows the empty-state message when there are no todos', () => {
    // Re-render by clicking add with empty input (should be a no-op)
    click('btn-add-todo');
    expect(el('todo-empty').style.display).not.toBe('none');
  });

  it('adds a todo when the Add button is clicked', () => {
    el('todo-input').value = 'Buy milk';
    click('btn-add-todo');
    const items = el('todo-list').querySelectorAll('.todo-item');
    expect(items.length).toBeGreaterThan(0);
    expect(el('todo-list').textContent).toContain('Buy milk');
  });

  it('clears the input field after adding a todo', () => {
    el('todo-input').value = 'Walk the dog';
    click('btn-add-todo');
    expect(el('todo-input').value).toBe('');
  });

  it('hides the empty-state message after adding a todo', () => {
    el('todo-input').value = 'Write tests';
    click('btn-add-todo');
    expect(el('todo-empty').style.display).toBe('none');
  });

  it('does not add a todo when the input is blank', () => {
    el('todo-input').value = '   ';
    click('btn-add-todo');
    const items = el('todo-list').querySelectorAll('.todo-item');
    expect(items.length).toBe(0);
  });

  it('adds a todo when Enter is pressed in the input', () => {
    el('todo-input').value = 'Finish report';
    el('todo-input').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(el('todo-list').textContent).toContain('Finish report');
  });

  it('deletes a todo when the × button is clicked', () => {
    el('todo-input').value = 'Task to delete';
    click('btn-add-todo');
    const delBtn = el('todo-list').querySelector('.todo-del');
    delBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el('todo-list').textContent).not.toContain('Task to delete');
  });

  it('toggles the done state when the check button is clicked', () => {
    el('todo-input').value = 'Toggle me';
    click('btn-add-todo');
    const checkBtn = el('todo-list').querySelector('.todo-check');
    checkBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const text = el('todo-list').querySelector('.todo-text');
    expect(text.classList.contains('done')).toBe(true);
  });

  it('persists todos in localStorage after adding', () => {
    el('todo-input').value = 'Persistent task';
    click('btn-add-todo');
    const stored = JSON.parse(localStorage.getItem('aurora-todos') || '[]');
    const found = stored.some(t => t.text === 'Persistent task');
    expect(found).toBe(true);
  });
});
