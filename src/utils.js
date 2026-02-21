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

export const calculateStats = (history) => {
  if (history.length === 0) {
    return { max: 0, min: 0, avg: 0, total: 0 };
  }

  const values = history.map(h => h.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  const total = values.length;

  return { max, min, avg: parseFloat(avg), total };
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
 * Sort todos by date
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
 * Export data as JSON
 */
export const exportData = (data, filename) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
