import React, { useState, useMemo } from 'react';
import { validateTodo, sortTodos, generateId } from './utils';

export default function TodoList({ todos, onAddTodo, onToggleTodo, onDeleteTodo }) {
  const [inputValue, setInputValue] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterBy, setFilterBy] = useState('all');

  const handleAddTodo = () => {
    if (validateTodo(inputValue)) {
      onAddTodo({
        id: generateId(),
        text: inputValue,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const filteredTodos = useMemo(() => {
    let filtered = todos;
    
    if (filterBy === 'completed') {
      filtered = todos.filter(t => t.completed);
    } else if (filterBy === 'pending') {
      filtered = todos.filter(t => !t.completed);
    }

    return sortTodos(filtered, sortBy);
  }, [todos, sortBy, filterBy]);

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h2>Todo List</h2>

        <div className="todo-progress">
          <div className="progress-info">
            <span className="progress-label">Progress</span>
            <span className="progress-stat">{completedCount} / {totalCount}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        <div className="todo-input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="todo-input"
            maxLength={200}
          />
          <button 
            className="btn btn-primary"
            onClick={handleAddTodo}
            disabled={!validateTodo(inputValue)}
          >
            Add Todo
          </button>
        </div>

        <div className="todo-controls">
          <div className="control-group">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="select-control"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="pending">Pending First</option>
              <option value="completed">Completed First</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="filter-select">Filter:</label>
            <select 
              id="filter-select"
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="select-control"
            >
              <option value="all">All Todos</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">
              {todos.length === 0 ? 'No todos yet. Add one to get started!' : 'No todos match your filter.'}
            </p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                    className="todo-checkbox"
                    aria-label={`Toggle completion for: ${todo.text}`}
                  />
                  <span className="todo-text">{todo.text}</span>
                </div>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => onDeleteTodo(todo.id)}
                  title="Delete todo"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="todo-stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">{completedCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending:</span>
            <span className="stat-value">{totalCount - completedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
