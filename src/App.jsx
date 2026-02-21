import React, { useState, useEffect } from 'react';
import Counter from './Counter';
import TodoList from './TodoList';
import History from './History';
import Settings from './Settings';
import { loadFromStorage, saveToStorage } from './utils';

export default function App() {
  // Counter state
  const [count, setCount] = useState(() => loadFromStorage('count', 0));
  const [history, setHistory] = useState(() => loadFromStorage('history', []));

  // Todo state
  const [todos, setTodos] = useState(() => loadFromStorage('todos', []));

  // UI state
  const [activeTab, setActiveTab] = useState('counter');
  const [theme, setTheme] = useState(() => loadFromStorage('theme', 'light'));

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('count', count);
  }, [count]);

  useEffect(() => {
    saveToStorage('history', history);
  }, [history]);

  useEffect(() => {
    saveToStorage('todos', todos);
  }, [todos]);

  useEffect(() => {
    saveToStorage('theme', theme);
    applyTheme(theme);
  }, [theme]);

  // Apply theme to document
  const applyTheme = (selectedTheme) => {
    const htmlElement = document.documentElement;
    
    if (selectedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      htmlElement.setAttribute('data-theme', selectedTheme);
    }
  };

  // Counter handlers
  const handleIncrement = (amount = 1) => {
    const newCount = count + amount;
    setCount(newCount);
    recordHistory(amount, newCount);
  };

  const handleDecrement = (amount = 1) => {
    const newCount = count - amount;
    setCount(newCount);
    recordHistory(-amount, newCount);
  };

  const handleReset = () => {
    const amount = -count;
    setCount(0);
    recordHistory(amount, 0);
  };

  const handleCustomChange = (value) => {
    const amount = value - count;
    setCount(value);
    recordHistory(amount, value);
  };

  const recordHistory = (change, resultValue) => {
    const newEntry = {
      value: change,
      resultValue: resultValue,
      timestamp: Date.now()
    };
    setHistory([...history, newEntry]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Todo handlers
  const handleAddTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
        : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Settings handlers
  const handleThemeChange = (newTheme) => {
    if (newTheme === 'reset') {
      // Reset all data
      setCount(0);
      setTodos([]);
      setHistory([]);
      setTheme('light');
      localStorage.clear();
    } else {
      setTheme(newTheme);
    }
  };

  const appData = {
    count,
    todos,
    history,
    theme,
    exportedAt: new Date().toISOString()
  };

  return (
    <div className={`app-wrapper theme-${theme}`}>
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title">Dashboard</h1>
          <p className="app-subtitle">Counter, Todo List & More</p>
        </div>
      </div>

      <div className="app-container">
        <nav className="app-nav">
          <button
            className={`nav-btn ${activeTab === 'counter' ? 'active' : ''}`}
            onClick={() => setActiveTab('counter')}
          >
            <span className="nav-icon">🔢</span>
            <span className="nav-label">Counter</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <span className="nav-icon">✓</span>
            <span className="nav-label">Todos</span>
            {todos.length > 0 && (
              <span className="badge">{todos.length}</span>
            )}
          </button>
          <button
            className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">History</span>
            {history.length > 0 && (
              <span className="badge">{history.length}</span>
            )}
          </button>
          <button
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>

        <main className="app-content">
          {activeTab === 'counter' && (
            <Counter
              count={count}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onReset={handleReset}
              onCustomChange={handleCustomChange}
            />
          )}

          {activeTab === 'todos' && (
            <TodoList
              todos={todos}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          )}

          {activeTab === 'history' && (
            <History
              history={history}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              theme={theme}
              onThemeChange={handleThemeChange}
              appData={appData}
            />
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2026 Enhanced Dashboard App • Built with React & Vite</p>
      </footer>
    </div>
  );
}
