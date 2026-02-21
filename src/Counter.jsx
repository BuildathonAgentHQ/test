import React, { useState } from 'react';

export default function Counter({ count, onIncrement, onDecrement, onReset, onCustomChange }) {
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomChange = () => {
    const value = parseInt(customValue, 10);
    if (!isNaN(value)) {
      onCustomChange(value);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCustomChange();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  return (
    <div className="counter-container">
      <div className="counter-card">
        <h2>Counter App</h2>
        <div className="counter-display">
          <div className="count-value" aria-live="polite">
            {count}
          </div>
          <div className="count-label">Current Count</div>
        </div>

        <div className="counter-controls">
          <button 
            className="btn btn-secondary"
            onClick={() => onDecrement(1)}
            title="Decrease by 1"
          >
            <span className="btn-icon">−</span>
            <span className="btn-text">Decrease</span>
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => onIncrement(1)}
            title="Increase by 1"
          >
            <span className="btn-text">Increase</span>
            <span className="btn-icon">+</span>
          </button>
        </div>

        <div className="counter-secondary-controls">
          <button 
            className="btn btn-small"
            onClick={() => onIncrement(10)}
            title="Increase by 10"
          >
            +10
          </button>
          <button 
            className="btn btn-small"
            onClick={() => onDecrement(10)}
            title="Decrease by 10"
          >
            −10
          </button>
          <button 
            className="btn btn-small"
            onClick={() => onIncrement(5)}
            title="Increase by 5"
          >
            +5
          </button>
          <button 
            className="btn btn-small"
            onClick={() => onDecrement(5)}
            title="Decrease by 5"
          >
            −5
          </button>
        </div>

        <div className="counter-custom">
          {!showCustomInput ? (
            <button 
              className="btn btn-tertiary"
              onClick={() => setShowCustomInput(true)}
            >
              Set Custom Value
            </button>
          ) : (
            <div className="custom-input-group">
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter a number"
                autoFocus
                aria-label="Custom counter value"
                onKeyPress={handleKeyPress}
                placeholder="Enter value"
                autoFocus
                className="custom-input"
              />
              <button 
                className="btn btn-small btn-success"
                onClick={handleCustomChange}
              >
                Set
              </button>
              <button 
                className="btn btn-small btn-danger"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomValue('');
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <button 
          className="btn btn-reset"
          onClick={onReset}
          title="Reset counter to 0"
        >
          Reset Counter
        </button>
      </div>
    </div>
  );
}
