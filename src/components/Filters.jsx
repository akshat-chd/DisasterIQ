// src/components/Filters.jsx

import React from 'react';

export default function Filters({
  filters,
  onFilterChange,
  showMagnitude = false,
  showTimeframe = false,
}) {
  return (
    <div className="filters">
      {showMagnitude && (
        <div className="filter-group">
          <label htmlFor="magnitude">Min. Magnitude</label>
          <select
            id="magnitude"
            value={filters.magMin}
            onChange={(e) => onFilterChange('magMin', Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={2.5}>2.5+</option>
            <option value={4.5}>4.5+ (Strong)</option>
          </select>
        </div>
      )}
      {showTimeframe && (
        <div className="filter-group">
          <label htmlFor="timeframe">Timeframe</label>
          <select
            id="timeframe"
            value={filters.days}
            onChange={(e) => onFilterChange('days', Number(e.target.value))}
          >
            <option value={1}>Past 24 hours</option>
            <option value={7}>Past 7 days</option>
            <option value={30}>Past 30 days</option>
            <option value={365}>Past Year</option>
          </select>
        </div>
      )}
    </div>
  );
}