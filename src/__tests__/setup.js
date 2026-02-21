// Global test setup

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock URL.createObjectURL / revokeObjectURL (used in exportData)
if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  globalThis.URL.revokeObjectURL = vi.fn();
}

// Clean localStorage between tests
beforeEach(() => {
  localStorage.clear();
});
