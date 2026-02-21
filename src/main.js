/**
 * Enhanced Dashboard Application - Vanilla JavaScript
 * Counter, Todo List, History Tracking, and Settings Management
 */

import {
  loadFromStorage,
  saveToStorage,
  formatTime,
  calculateStats,
  generateReportData,
  generateId,
  validateTodo,
  sortTodos,
  exportData
} from './utils.js';

// ============================================================================
// APPLICATION STATE
// ============================================================================

const state = {
  count: loadFromStorage('count', 0),
  history: loadFromStorage('history', []),
  todos: loadFromStorage('todos', []),
  theme: loadFromStorage('theme', 'light'),
  currentTab: 'counter'
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const elements = {
  // Navigation
  navBtns: document.querySelectorAll('.nav-btn'),
  tabContents: document.querySelectorAll('.tab-content'),

  // Counter
  countDisplay: document.getElementById('count-display'),
  btnIncrease: document.getElementById('btn-increase'),
  btnDecrease: document.getElementById('btn-decrease'),
  btnAdd10: document.getElementById('btn-add10'),
  btnSub10: document.getElementById('btn-sub10'),
  btnAdd5: document.getElementById('btn-add5'),
  btnSub5: document.getElementById('btn-sub5'),
  btnCustomToggle: document.getElementById('btn-custom-toggle'),
  customInputGroup: document.getElementById('custom-input-group'),
  customValueInput: document.getElementById('custom-value-input'),
  btnCustomSet: document.getElementById('btn-custom-set'),
  btnReset: document.getElementById('btn-reset'),

  // Todo
  todoInput: document.getElementById('todo-input'),
  btnAddTodo: document.getElementById('btn-add-todo'),
  todosList: document.getElementById('todos-list'),
  todoEmpty: document.getElementById('todo-empty'),
  completedCount: document.getElementById('completed-count'),
  totalCount: document.getElementById('total-count'),
  progressFill: document.getElementById('progress-fill'),
  todoBadge: document.getElementById('todo-badge'),
  sortSelect: document.getElementById('sort-select'),
  filterSelect: document.getElementById('filter-select'),

  // History
  btnStatsView: document.getElementById('btn-stats-view'),
  btnLogView: document.getElementById('btn-log-view'),
  statsSection: document.getElementById('stats-section'),
  logSection: document.getElementById('log-section'),
  statsGrid: document.getElementById('stats-grid'),
  statsEmpty: document.getElementById('stats-empty'),
  historyLog: document.getElementById('history-log'),
  logEmpty: document.getElementById('log-empty'),
  logCount: document.getElementById('log-count'),
  btnClearHistory: document.getElementById('btn-clear-history'),

  // Settings
  themeRadios: document.querySelectorAll('.theme-radio'),
  btnExportData: document.getElementById('btn-export-data'),
  exportSuccess: document.getElementById('export-success'),
  btnResetApp: document.getElementById('btn-reset-app')
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
  applyTheme(state.theme);
  setupEventListeners();
  updateUI();
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function applyTheme(theme) {
  let finalTheme = theme;
  if (theme === 'auto') {
    finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', finalTheme);
  saveToStorage('theme', theme);
  state.theme = theme;

  // Update radio button
  elements.themeRadios.forEach(radio => {
    radio.checked = radio.value === theme;
  });
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

function setupEventListeners() {
  // Tab navigation
  elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Counter controls
  elements.btnIncrease.addEventListener('click', () => incrementCount(1));
  elements.btnDecrease.addEventListener('click', () => decrementCount(1));
  elements.btnAdd10.addEventListener('click', () => incrementCount(10));
  elements.btnSub10.addEventListener('click', () => decrementCount(10));
  elements.btnAdd5.addEventListener('click', () => incrementCount(5));
  elements.btnSub5.addEventListener('click', () => decrementCount(5));
  elements.btnCustomToggle.addEventListener('click', toggleCustomInput);
  elements.btnCustomSet.addEventListener('click', setCustomValue);
  elements.customValueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') setCustomValue();
    if (e.key === 'Escape') toggleCustomInput();
  });
  elements.btnReset.addEventListener('click', resetCount);

  // Todo controls
  elements.btnAddTodo.addEventListener('click', addTodo);
  elements.todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  elements.sortSelect.addEventListener('change', updateUI);
  elements.filterSelect.addEventListener('change', updateUI);

  // History controls
  elements.btnStatsView.addEventListener('click', showStatsView);
  elements.btnLogView.addEventListener('click', showLogView);
  elements.btnClearHistory.addEventListener('click', clearHistory);

  // Settings controls
  elements.themeRadios.forEach(radio => {
    radio.addEventListener('change', () => applyTheme(radio.value));
  });
  elements.btnExportData.addEventListener('click', handleExportData);
  elements.btnResetApp.addEventListener('click', handleResetApp);
}

// ============================================================================
// TAB MANAGEMENT
// ============================================================================

function switchTab(tabName) {
  state.currentTab = tabName;
  
  // Update nav buttons
  elements.navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab contents
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}-tab`);
  });

  updateUI();
}

// ============================================================================
// COUNTER FUNCTIONS
// ============================================================================

function incrementCount(amount = 1) {
  const oldCount = state.count;
  state.count += amount;
  recordHistory(amount, state.count);
  saveToStorage('count', state.count);
  updateUI();
}

function decrementCount(amount = 1) {
  const oldCount = state.count;
  state.count -= amount;
  recordHistory(-amount, state.count);
  saveToStorage('count', state.count);
  updateUI();
}

function setCustomValue() {
  const value = parseInt(elements.customValueInput.value, 10);
  if (!isNaN(value)) {
    const amount = value - state.count;
    state.count = value;
    recordHistory(amount, state.count);
    saveToStorage('count', state.count);
    elements.customValueInput.value = '';
    toggleCustomInput();
    updateUI();
  }
}

function resetCount() {
  const amount = -state.count;
  state.count = 0;
  recordHistory(amount, 0);
  saveToStorage('count', state.count);
  updateUI();
}

function toggleCustomInput() {
  elements.customInputGroup.classList.toggle('hidden');
  if (!elements.customInputGroup.classList.contains('hidden')) {
    elements.customValueInput.focus();
  }
}

function recordHistory(change, resultValue) {
  const entry = {
    value: change,
    resultValue: resultValue,
    timestamp: Date.now()
  };
  state.history.push(entry);
  saveToStorage('history', state.history);
}

// ============================================================================
// TODO FUNCTIONS
// ============================================================================

function addTodo() {
  const text = elements.todoInput.value.trim();
  if (validateTodo(text)) {
    const todo = {
      id: generateId(),
      text: text,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    state.todos.push(todo);
    saveToStorage('todos', state.todos);
    elements.todoInput.value = '';
    updateUI();
  }
}

function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    todo.updatedAt = Date.now();
    saveToStorage('todos', state.todos);
    updateUI();
  }
}

function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  saveToStorage('todos', state.todos);
  updateUI();
}

// ============================================================================
// HISTORY FUNCTIONS
// ============================================================================

function showStatsView() {
  elements.btnStatsView.classList.add('active');
  elements.btnLogView.classList.remove('active');
  elements.statsSection.classList.remove('hidden');
  elements.logSection.classList.add('hidden');
  updateUI();
}

function showLogView() {
  elements.btnLogView.classList.add('active');
  elements.btnStatsView.classList.remove('active');
  elements.logSection.classList.remove('hidden');
  elements.statsSection.classList.add('hidden');
  updateUI();
}

function clearHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    state.history = [];
    saveToStorage('history', state.history);
    updateUI();
  }
}

// ============================================================================
// SETTINGS FUNCTIONS
// ============================================================================

function handleExportData() {
  const data = {
    count: state.count,
    todos: state.todos,
    history: state.history,
    theme: state.theme,
    exportedAt: new Date().toISOString()
  };
  const timestamp = new Date().toISOString().slice(0, 10);
  exportData(data, `app-data-${timestamp}.json`);
  
  elements.exportSuccess.classList.remove('hidden');
  setTimeout(() => {
    elements.exportSuccess.classList.add('hidden');
  }, 3000);
}

function handleResetApp() {
  if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

function updateUI() {
  updateCounter();
  updateTodos();
  updateHistory();
}

function updateCounter() {
  elements.countDisplay.textContent = state.count;
}

function updateTodos() {
  const completedCount = state.todos.filter(t => t.completed).length;
  const totalCount = state.todos.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  elements.completedCount.textContent = completedCount;
  elements.totalCount.textContent = totalCount;
  elements.progressFill.style.width = completionPercentage + '%';

  // Update badge
  if (totalCount > completedCount) {
    elements.todoBadge.textContent = totalCount - completedCount;
    elements.todoBadge.style.display = 'inline-flex';
  } else {
    elements.todoBadge.style.display = 'none';
  }

  // Filter and sort todos
  let filteredTodos = state.todos;
  const filterValue = elements.filterSelect.value;
  if (filterValue === 'completed') {
    filteredTodos = state.todos.filter(t => t.completed);
  } else if (filterValue === 'pending') {
    filteredTodos = state.todos.filter(t => !t.completed);
  }

  filteredTodos = sortTodos(filteredTodos, elements.sortSelect.value);

  // Render todos list
  elements.todosList.innerHTML = '';
  if (filteredTodos.length === 0) {
    elements.todoEmpty.style.display = 'block';
  } else {
    elements.todoEmpty.style.display = 'none';
    filteredTodos.forEach(todo => {
      const todoEl = document.createElement('div');
      todoEl.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      todoEl.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <span class="todo-date">${formatTime(todo.createdAt)}</span>
        <button class="btn btn-small btn-delete" data-id="${todo.id}">Delete</button>
      `;

      const checkbox = todoEl.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => toggleTodo(todo.id));

      const deleteBtn = todoEl.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

      elements.todosList.appendChild(todoEl);
    });
  }
}

function updateHistory() {
  const stats = calculateStats(state.history);

  // Update stats view
  if (state.history.length === 0) {
    elements.statsGrid.innerHTML = '';
    elements.statsEmpty.style.display = 'block';
  } else {
    elements.statsEmpty.style.display = 'none';
    elements.statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <span class="stat-label">Maximum</span>
          <span class="stat-value">${stats.max}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📉</div>
        <div class="stat-info">
          <span class="stat-label">Minimum</span>
          <span class="stat-value">${stats.min}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <span class="stat-label">Average</span>
          <span class="stat-value">${stats.avg}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔢</div>
        <div class="stat-info">
          <span class="stat-label">Total Changes</span>
          <span class="stat-value">${stats.total}</span>
        </div>
      </div>
    `;
  }

  // Update log view
  const reversedHistory = [...state.history].reverse();
  elements.logCount.textContent = `${reversedHistory.length} changes`;

  if (reversedHistory.length === 0) {
    elements.historyLog.innerHTML = '';
    elements.logEmpty.style.display = 'block';
  } else {
    elements.logEmpty.style.display = 'none';
    elements.historyLog.innerHTML = reversedHistory.map((entry, index) => `
      <div class="history-entry">
        <div class="entry-main">
          <span class="entry-action">
            ${entry.value > 0 ? `<span class="positive">+${entry.value}</span>` : `<span class="negative">${entry.value}</span>`}
          </span>
          <span class="entry-result">→ ${entry.resultValue}</span>
        </div>
        <div class="entry-time">${formatTime(entry.timestamp)}</div>
      </div>
    `).join('');
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// INITIALIZE APP
// ============================================================================

document.addEventListener('DOMContentLoaded', init);

// Hot Module Replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}
