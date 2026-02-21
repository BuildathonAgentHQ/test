import React, { useState, useEffect } from 'react';
import { exportData } from './utils';

export default function Settings({ theme, onThemeChange, appData }) {
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const handleExportData = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportData(appData, `app-data-${timestamp}.json`);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleResetApp = () => {
    if (window.confirm('Are you sure? This will clear all data. This action cannot be undone.')) {
      onThemeChange('reset');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Settings</h2>

        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <div className="setting-label">
              <span className="label-text">Theme</span>
              <span className="label-description">Choose your preferred color theme</span>
            </div>
            <div className="theme-options">
              {['light', 'dark', 'auto'].map((themeOption) => (
                <label key={themeOption} className="theme-option">
                  <input
                    type="radio"
                    name="theme"
                    value={themeOption}
                    checked={theme === themeOption}
                    onChange={(e) => onThemeChange(e.target.value)}
                    className="theme-radio"
                  />
                  <span className="theme-label">
                    {themeOption === 'light' && '☀️ Light'}
                    {themeOption === 'dark' && '🌙 Dark'}
                    {themeOption === 'auto' && '🔄 Auto'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Data Management</h3>
          
          <div className="setting-item">
            <div className="setting-label">
              <span className="label-text">Export Data</span>
              <span className="label-description">Download all your data as JSON</span>
            </div>
            <div className="setting-action">
              <button 
                className="btn btn-primary"
                onClick={handleExportData}
              >
                📥 Export as JSON
              </button>
              {showExportSuccess && (
                <span className="success-message">✓ Exported successfully!</span>
              )}
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="label-text">Reset Application</span>
              <span className="label-description">Clear all data and reset to default state</span>
            </div>
            <div className="setting-action">
              <button 
                className="btn btn-danger-large"
                onClick={handleResetApp}
              >
                🔄 Reset All Data
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <div className="about-info">
            <div className="info-item">
              <span className="info-label">Application</span>
              <span className="info-value">Enhanced Counter & Todo App</span>
            </div>
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">2.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Framework</span>
              <span className="info-value">React 18 + Vite</span>
            </div>
            <div className="info-item">
              <span className="info-label">Storage</span>
              <span className="info-value">Local Browser Storage</span>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <p className="footer-text">
            💡 Tips: All your data is stored locally in your browser. You can export your data anytime before clearing.
          </p>
        </div>
      </div>
    </div>
  );
}
