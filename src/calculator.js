/**
 * Calculator logic
 *
 * State machine with four fields:
 *   current  – number being typed
 *   previous – left-hand operand
 *   operator – pending operator symbol
 *   fresh    – true right after = or an operator press (next digit replaces display)
 */

const state = {
  current: '0',
  previous: '',
  operator: null,
  fresh: false,
};

// ─── DOM refs ────────────────────────────────────────────
const resultEl     = document.getElementById('result');
const expressionEl = document.getElementById('expression');

// ─── Display helpers ─────────────────────────────────────
function updateDisplay() {
  resultEl.textContent = state.current;

  // Shrink font for long numbers
  const len = state.current.replace('-', '').length;
  resultEl.classList.toggle('small',  len > 9);
  resultEl.classList.toggle('xsmall', len > 13);

  // Show pending expression above
  expressionEl.textContent = state.operator
    ? `${state.previous} ${state.operator}`
    : '';
}

function formatNumber(n) {
  const num = parseFloat(n);
  if (isNaN(num)) return 'Error';

  // Avoid floating-point noise (e.g. 0.1+0.2 => 0.3 not 0.30000…)
  const rounded = parseFloat(num.toPrecision(12));
  const str = String(rounded);

  // Cap display at 12 significant digits
  return str.length > 12 ? rounded.toExponential(6) : str;
}

// ─── Input handlers ───────────────────────────────────────
function inputDigit(digit) {
  if (state.fresh) {
    state.current = digit === '.' ? '0.' : digit;
    state.fresh = false;
  } else {
    if (digit === '.' && state.current.includes('.')) return;
    if (state.current === '0' && digit !== '.') {
      state.current = digit;
    } else {
      if (state.current.length >= 15) return; // prevent overflow
      state.current += digit;
    }
  }
  updateDisplay();
}

function chooseOperator(op) {
  // If there's a pending operation, evaluate it first
  if (state.operator && !state.fresh) {
    calculate();
  }

  state.previous = state.current;
  state.operator  = op;
  state.fresh     = true;

  // Highlight active operator button
  document.querySelectorAll('.btn-operator').forEach(b => {
    b.classList.toggle('active', b.dataset.op === op);
  });

  updateDisplay();
}

function calculate() {
  if (!state.operator || state.fresh) return;

  const prev = parseFloat(state.previous);
  const curr = parseFloat(state.current);
  let result;

  switch (state.operator) {
    case '+': result = prev + curr; break;
    case '−': result = prev - curr; break;
    case '×': result = prev * curr; break;
    case '÷':
      if (curr === 0) { state.current = 'Error'; state.operator = null; updateDisplay(); return; }
      result = prev / curr;
      break;
    default: return;
  }

  // Show full expression in the label before clearing operator
  expressionEl.textContent = `${state.previous} ${state.operator} ${state.current} =`;

  state.current  = formatNumber(result);
  state.previous = '';
  state.operator  = null;
  state.fresh     = true;

  document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));
  updateDisplay();
}

function clear() {
  state.current  = '0';
  state.previous = '';
  state.operator  = null;
  state.fresh     = false;
  document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));
  updateDisplay();
}

function toggleSign() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay();
}

function percent() {
  const n = parseFloat(state.current);
  if (isNaN(n)) return;
  state.current = formatNumber(
    state.previous && state.operator
      ? (parseFloat(state.previous) * n) / 100
      : n / 100
  );
  updateDisplay();
}

// ─── Event delegation ─────────────────────────────────────
document.querySelector('.calc-buttons').addEventListener('click', e => {
  const btn = e.target.closest('.btn-calc');
  if (!btn) return;

  if (btn.dataset.num  !== undefined) inputDigit(btn.dataset.num);
  if (btn.dataset.op   !== undefined) chooseOperator(btn.dataset.op);
  if (btn.dataset.action) {
    switch (btn.dataset.action) {
      case 'clear':       clear();       break;
      case 'toggle-sign': toggleSign();  break;
      case 'percent':     percent();     break;
      case 'equals':      calculate();   break;
    }
  }
});

// ─── Keyboard support ─────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') { inputDigit(e.key); return; }
  if (e.key === '.')                 { inputDigit('.');   return; }
  if (e.key === '+')                 { chooseOperator('+'); return; }
  if (e.key === '-')                 { chooseOperator('−'); return; }
  if (e.key === '*')                 { chooseOperator('×'); return; }
  if (e.key === '/')                 { e.preventDefault(); chooseOperator('÷'); return; }
  if (e.key === 'Enter' || e.key === '=') { calculate(); return; }
  if (e.key === 'Escape')            { clear();     return; }
  if (e.key === '%')                 { percent();   return; }
  if (e.key === 'Backspace') {
    if (state.current.length > 1) {
      state.current = state.current.slice(0, -1);
    } else {
      state.current = '0';
    }
    updateDisplay();
  }
});

// ─── Init ─────────────────────────────────────────────────
updateDisplay();
