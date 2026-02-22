/**
 * Utility functions for the application
 */

/**
 * Load data from localStorage
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading from storage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * Save data to localStorage
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error);
  }
};

/**
 * Format timestamp to readable format
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Calculate statistics from counter history
 */
export const calculateStats = (history) => {
  if (history.length === 0) {
    return { max: 0, min: 0, avg: 0, total: 0 };
  }

  const resultValues = history.map(h => h.resultValue);
  const max = Math.max(...resultValues);
  const min = Math.min(...resultValues);
  const avg = (resultValues.reduce((a, b) => a + b, 0) / resultValues.length).toFixed(2);
  const total = history.length;

  return { max, min, avg: parseFloat(avg), total };
};

/**
 * Generate a report with detailed statistics
 */
export const generateReportData = (history) => {
  const stats = calculateStats(history);
  return {
    ...stats,
    generatedAt: Date.now(),
    historyCount: history.length
  };
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

/**
 * Validate todo item
 */
export const validateTodo = (todo) => {
  return todo && todo.trim().length > 0 && todo.trim().length <= 200;
};

/**
 * Sort todos by criteria
 */
export const sortTodos = (todos, sortBy = 'date-desc') => {
  const sorted = [...todos];

  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) => a.createdAt - b.createdAt);
    case 'date-desc':
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    case 'completed':
      return sorted.sort((a, b) => a.completed - b.completed);
    case 'pending':
      return sorted.sort((a, b) => b.completed - a.completed);
    default:
      return sorted;
  }
};

/**
 * Export data as JSON file
 */
export const exportData = (data, filename) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Get application analytics
 */
export const getAppAnalytics = (state) => {
  return {
    totalCounterChanges: state.history.length,
    totalTodos: state.todos.length,
    completedTodos: state.todos.filter(t => t.completed).length,
    pendingTodos: state.todos.filter(t => !t.completed).length,
    currentCount: state.count,
    currentTheme: state.theme,
    appStartTime: new Date().toISOString()
  };
};

/**
 * Clear all application data
 */
export const clearAllData = () => {
  localStorage.clear();
  location.reload();
};

/**
 * Get application version
 */
export const getAppVersion = () => {
  return '3.0.0';
};
