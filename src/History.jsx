import React, { useState, useMemo } from 'react';
import { formatTime, calculateStats, generateReportData } from './utils';

export default function History({ history, onClearHistory }) {
  const [showStats, setShowStats] = useState(true);
  const stats = useMemo(() => calculateStats(history), [history]);

  const visibleHistory = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  return (
    <div className="history-container">
      <div className="history-card">
        <div className="history-header">
          <h2>Counter History</h2>
          <div className="history-toggle">
            <button
              className={`toggle-btn ${showStats ? 'active' : ''}`}
              onClick={() => setShowStats(true)}
            >
              Stats
            </button>
            <button
              className={`toggle-btn ${!showStats ? 'active' : ''}`}
              onClick={() => setShowStats(false)}
            >
              Log
            </button>
          </div>
        </div>

        {showStats ? (
          <div className="stats-section">
            {history.length === 0 ? (
              <div className="empty-state">
                <p className="empty-message">No counter history yet. Start counting!</p>
              </div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <span className="stat-label">Maximum</span>
                    <span className="stat-value">{stats.max}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📉</div>
                  <div className="stat-info">
                    <span className="stat-label">Minimum</span>
                    <span className="stat-value">{stats.min}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <span className="stat-label">Average</span>
                    <span className="stat-value">{stats.avg}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🔢</div>
                  <div className="stat-info">
                    <span className="stat-label">Total Changes</span>
                    <span className="stat-value">{stats.total}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="log-section">
            {visibleHistory.length === 0 ? (
              <div className="empty-state">
                <p className="empty-message">No counter changes yet.</p>
              </div>
            ) : (
              <>
                <div className="log-controls">
                  <span className="log-count">{visibleHistory.length} changes</span>
                  <button 
                    className="btn btn-small btn-danger"
                    onClick={onClearHistory}
                  >
                    Clear History
                  </button>
                </div>

                <div className="history-log">
                  <ol className="history-list" start={visibleHistory.length}>
                    {visibleHistory.map((entry, index) => (
                      <li key={index} className="history-entry">
                        <div className="entry-main">
                          <span className="entry-action">
                            {entry.value > 0 ? (
                              <span className="positive">+{entry.value}</span>
                            ) : (
                              <span className="negative">{entry.value}</span>
                            )}
                          </span>
                          <span className="entry-result">→ {entry.resultValue}</span>
                        </div>
                        <span className="entry-time">{formatTime(entry.timestamp)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
