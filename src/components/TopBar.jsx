// src/components/TopBar.jsx

import React from 'react';
import { DISASTER_TYPES } from '../utils/constants';
import Filters from './Filters';
import { ShieldAlert } from 'lucide-react';

export default function TopBar({ activeType, setActiveType, filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters(currentFilters => ({ ...currentFilters, [key]: value }));
  };

  return (
    <header className="top-bar">
      <div className="logo-section">
        <ShieldAlert size={28} className="logo-icon" />
        <div className="logo-text">
          <h1>India Disaster Monitor</h1>
          <p>Real-time Natural Event Tracking</p>
        </div>
      </div>
      
      <nav className="tabs">
        {DISASTER_TYPES.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveType(tab.key)}
            className={`tab-button ${activeType === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="filters-section">
        {(activeType === 'earthquake' || activeType === 'cyclone' || activeType === 'flood') && (
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            showMagnitude={activeType === 'earthquake'}
            showTimeframe={true}
          />
        )}
      </div>
    </header>
  );
}