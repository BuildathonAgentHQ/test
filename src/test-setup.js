/**
 * Global test setup — mocks browser APIs unavailable in jsdom.
 */

// ── Canvas ───────────────────────────────────────────────────────────────────
const canvasCtxMock = {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
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
  fillStyle: '',
  globalCompositeOperation: '',
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => canvasCtxMock);

// ── requestAnimationFrame ─────────────────────────────────────────────────────
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));

// ── AudioContext ──────────────────────────────────────────────────────────────
global.AudioContext = vi.fn(() => ({
  createOscillator: vi.fn(() => ({
    type: 'sine',
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createGain: vi.fn(() => ({
    gain: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  })),
  currentTime: 0,
  destination: {},
  close: vi.fn(),
}));
global.webkitAudioContext = global.AudioContext;

// ── URL ───────────────────────────────────────────────────────────────────────
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();
