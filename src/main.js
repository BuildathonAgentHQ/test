/**
 * Aurora Focus — main.js
 * Canvas: animated starfield + aurora borealis waves
 * UI: live clock, Pomodoro timer, quick todo list
 */

// ─── Canvas / Animation ──────────────────────────────────────────────────────

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Stars
const STAR_COUNT = 320;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.4 + 0.3,
  alpha: Math.random(),
  speed: Math.random() * 0.008 + 0.002,
  phase: Math.random() * Math.PI * 2,
}));

// Aurora bands
const BANDS = [
  { color1: [72, 52, 212], color2: [120, 80, 255], yBase: 0.18, amp: 0.10, freq: 0.9, speed: 0.00025, phase: 0 },
  { color1: [30, 120, 200], color2: [80, 200, 240], yBase: 0.30, amp: 0.08, freq: 1.3, speed: 0.00018, phase: 1.2 },
  { color1: [100, 20, 180], color2: [200, 60, 200], yBase: 0.10, amp: 0.06, freq: 0.7, speed: 0.00032, phase: 2.4 },
  { color1: [20, 60, 140], color2: [40, 180, 180], yBase: 0.40, amp: 0.05, freq: 1.8, speed: 0.00015, phase: 3.8 },
];

// Mouse for interactive parallax
const mouse = { x: 0.5, y: 0.5 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX / window.innerWidth;
  mouse.y = e.clientY / window.innerHeight;
});

let t = 0;

function drawAurora(band) {
  const SEGS = 80;
  const alpha = 0.25;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const [r1, g1, b1] = band.color1;
  const [r2, g2, b2] = band.color2;

  for (let i = 0; i <= SEGS; i++) {
    const px = (i / SEGS) * W;
    const progress = i / SEGS;
    const wave = Math.sin(progress * Math.PI * 2 * band.freq + t * band.speed * 60000 + band.phase)
                 + 0.35 * Math.sin(progress * Math.PI * 4 * band.freq + t * band.speed * 80000 + band.phase + 0.8);

    const centerY = (band.yBase + mouse.y * 0.04) * H + wave * band.amp * H;
    const thickness = (0.06 + 0.025 * Math.sin(progress * Math.PI)) * H;

    const gradient = ctx.createLinearGradient(px, centerY - thickness, px, centerY + thickness);
    gradient.addColorStop(0, `rgba(${r1},${g1},${b1},0)`);
    gradient.addColorStop(0.3, `rgba(${r1},${g1},${b1},${alpha})`);
    gradient.addColorStop(0.5, `rgba(${r2},${g2},${b2},${alpha * 1.4})`);
    gradient.addColorStop(0.7, `rgba(${r2},${g2},${b2},${alpha})`);
    gradient.addColorStop(1, `rgba(${r1},${g1},${b1},0)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(px - W / SEGS / 2, centerY - thickness, W / SEGS + 1, thickness * 2);
  }

  ctx.restore();
}

function drawStars() {
  stars.forEach(s => {
    s.alpha += s.speed * Math.sin(t * 0.001 + s.phase);
    s.alpha = Math.max(0.05, Math.min(1, s.alpha));

    const px = (s.x + (mouse.x - 0.5) * 0.015) * W;
    const py = (s.y + (mouse.y - 0.5) * 0.015) * H;

    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 230, 255, ${s.alpha})`;
    ctx.fill();
  });
}

function drawVignette() {
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85);
  grad.addColorStop(0, 'rgba(3,5,16,0)');
  grad.addColorStop(1, 'rgba(3,5,16,0.82)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function frame(ts) {
  t = ts;
  ctx.fillStyle = '#030510';
  ctx.fillRect(0, 0, W, H);

  BANDS.forEach(drawAurora);
  drawStars();
  drawVignette();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Inject SVG gradient for timer ring
document.querySelector('.timer-ring').insertAdjacentHTML('afterbegin', `
  <defs>
    <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#7c9fff"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
`);

// ─── Clock ────────────────────────────────────────────────────────────────────

const clockTime = document.getElementById('clock-time');
const clockDate = document.getElementById('clock-date');
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clockTime.textContent = `${h}:${m}:${s}`;
  clockDate.textContent = `${DAYS[now.getDay()]} · ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}
updateClock();
setInterval(updateClock, 1000);

// ─── Pomodoro Timer ───────────────────────────────────────────────────────────

const MODES = [
  { label: 'FOCUS',   duration: 25 * 60, next: '5m' },
  { label: 'BREAK',   duration:  5 * 60, next: '25m' },
];

let modeIdx = 0;
let remaining = MODES[0].duration;
let running = false;
let interval = null;
let sessions = 0;

const timerLabel   = document.getElementById('timer-label');
const timerDisplay = document.getElementById('timer-display');
const ringFill     = document.getElementById('timer-ring-fill');
const btnToggle    = document.getElementById('btn-timer-toggle');
const btnReset     = document.getElementById('btn-timer-reset');
const btnMode      = document.getElementById('btn-timer-mode');
const sessionDots  = document.getElementById('session-dots');
const sessionCount = document.getElementById('session-count');

const CIRCUMFERENCE = 327; // 2π × 52

function renderTimer() {
  const total = MODES[modeIdx].duration;
  const frac = remaining / total;
  const offset = CIRCUMFERENCE * (1 - frac);
  ringFill.style.strokeDashoffset = offset;

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  timerDisplay.textContent = `${mm}:${ss}`;

  timerLabel.textContent = MODES[modeIdx].label;
  btnMode.textContent = MODES[modeIdx].next;
}

function renderSessions() {
  const dots = Array.from({ length: 4 }, (_, i) => {
    const done = i < (sessions % 4);
    return `<span class="session-dot ${done ? 'done' : ''}"></span>`;
  }).join('');
  sessionDots.innerHTML = dots;
  sessionCount.textContent = `Session ${sessions + 1}`;
}

function startTimer() {
  running = true;
  btnToggle.innerHTML = '&#9646;&#9646;'; // pause icon
  interval = setInterval(() => {
    remaining--;
    renderTimer();
    if (remaining <= 0) {
      clearInterval(interval);
      running = false;
      btnToggle.innerHTML = '&#9654;';
      if (modeIdx === 0) sessions++;
      renderSessions();
      modeIdx = (modeIdx + 1) % MODES.length;
      remaining = MODES[modeIdx].duration;
      renderTimer();
      // Flash ring
      ringFill.style.stroke = modeIdx === 0 ? '#7c9fff' : '#34d399';
    }
  }, 1000);
}

function pauseTimer() {
  running = false;
  btnToggle.innerHTML = '&#9654;';
  clearInterval(interval);
}

function resetTimer() {
  pauseTimer();
  remaining = MODES[modeIdx].duration;
  renderTimer();
}

function switchMode() {
  pauseTimer();
  modeIdx = (modeIdx + 1) % MODES.length;
  remaining = MODES[modeIdx].duration;
  renderTimer();
}

btnToggle.addEventListener('click', () => running ? pauseTimer() : startTimer());
btnReset.addEventListener('click', resetTimer);
btnMode.addEventListener('click', switchMode);

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); running ? pauseTimer() : startTimer(); }
  if (e.key === 'r' || e.key === 'R') resetTimer();
  if (e.key === 'm' || e.key === 'M') switchMode();
});

renderTimer();
renderSessions();

// ─── Todo List ────────────────────────────────────────────────────────────────

const todoInput = document.getElementById('todo-input');
const btnAddTodo = document.getElementById('btn-add-todo');
const todoList  = document.getElementById('todo-list');
const todoEmpty = document.getElementById('todo-empty');

let todos = JSON.parse(localStorage.getItem('aurora-todos') || '[]');

function saveTodos() {
  localStorage.setItem('aurora-todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  todoEmpty.style.display = todos.length === 0 ? 'block' : 'none';

  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const check = document.createElement('button');
    check.className = `todo-check ${todo.done ? 'checked' : ''}`;
    check.addEventListener('click', () => {
      todos[idx].done = !todos[idx].done;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement('span');
    text.className = `todo-text ${todo.done ? 'done' : ''}`;
    text.textContent = todo.text;

    const del = document.createElement('button');
    del.className = 'todo-del';
    del.textContent = '✕';
    del.addEventListener('click', () => {
      todos.splice(idx, 1);
      saveTodos();
      renderTodos();
    });

    li.append(check, text, del);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.unshift({ text, done: false, id: Date.now() });
  saveTodos();
  renderTodos();
  todoInput.value = '';
}

btnAddTodo.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });

renderTodos();

// ─── Ambient Tone (Web Audio) ────────────────────────────────────────────────

let audioCtx = null;
let droneNodes = [];
let soundOn = false;

const btnSound = document.getElementById('btn-sound');
const soundIcon = document.getElementById('sound-icon');

function buildDrone() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const freqs = [55, 82.5, 110, 165];
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(0, audioCtx.currentTime);
  master.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 2);
  master.connect(audioCtx.destination);

  freqs.forEach(f => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;

    const tremolo = audioCtx.createOscillator();
    tremolo.frequency.value = 0.12 + Math.random() * 0.05;

    const tremoloGain = audioCtx.createGain();
    tremoloGain.gain.value = 0.3;
    tremolo.connect(tremoloGain);

    const oscGain = audioCtx.createGain();
    oscGain.gain.value = 0.25;
    tremoloGain.connect(oscGain.gain);

    osc.connect(oscGain);
    oscGain.connect(master);

    osc.start();
    tremolo.start();
    droneNodes.push(osc, tremolo);
  });

  return master;
}

let droneGain = null;

btnSound.addEventListener('click', () => {
  if (!soundOn) {
    droneGain = buildDrone();
    soundOn = true;
    btnSound.classList.add('active');
    soundIcon.textContent = '♫';
  } else {
    if (droneGain) {
      droneGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
      setTimeout(() => {
        droneNodes.forEach(n => n.stop());
        droneNodes = [];
        audioCtx.close();
        audioCtx = null;
        droneGain = null;
      }, 1600);
    }
    soundOn = false;
    btnSound.classList.remove('active');
    soundIcon.textContent = '♪';
  }
});
