// Global test setup

// Mock canvas API (jsdom doesn't implement it)
HTMLCanvasElement.prototype.getContext = function () {
  return {
    fillStyle: '',
    fillRect: () => {},
    save: () => {},
    restore: () => {},
    globalCompositeOperation: '',
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
  };
};

// Mock URL.createObjectURL / revokeObjectURL
global.URL.createObjectURL = () => 'blob:mock';
global.URL.revokeObjectURL = () => {};

// Mock AudioContext
global.AudioContext = class {
  createGain() {
    const gain = {
      gain: {
        value: 1,
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
    return gain;
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 0 },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  get currentTime() { return 0; }
  get destination() { return {}; }
  close() {}
};
global.webkitAudioContext = global.AudioContext;

// Suppress console.error during tests (for expected error paths)
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = () => {};
});
afterEach(() => {
  console.error = originalConsoleError;
});
