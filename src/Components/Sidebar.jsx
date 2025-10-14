// src/components/Sidebar.jsx

import React from 'react';
import { DISASTER_TYPES } from '../utils/constants';
import Filters from './Filters';
import EventListItem from './EventListItem';
import Loader from './Loader';

export default function Sidebar({
  isOpen,
  activeType,
  setActiveType,
  filters,
  setFilters,
  events,
  selectedId,
  setSelectedId,
  setSidebarOpen,
}) {
  const handleItemClick = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(currentFilters => ({ ...currentFilters, [key]: value }));
  };

  const renderContent = () => {
    if (events.loading) return <Loader />;
    if (events.error === 'not_implemented') {
      return <div className="message">Data for this disaster type is not yet available.</div>;
    }
    if (events.error) {
      return <div className="message error">{events.error}</div>;
    }
    if (events.data.length === 0) {
      let messageText = '';
      switch (activeType) {
        case 'earthquake': messageText = 'No earthquakes recorded for the selected criteria.'; break;
        case 'cyclone': messageText = 'No cyclones found for the selected timeframe.'; break;
        case 'flood': messageText = 'No floods found for the selected timeframe.'; break;
        default: messageText = 'No events found.';
      }
      return <div className="message">{messageText}</div>;
    }
    return events.data.map((event) => (
      <EventListItem
        key={event.id}
        event={event}
        isSelected={selectedId === event.id}
        onClick={() => handleItemClick(event.id)}
      />
    ));
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <header className="sidebar-header">
        <h1>India Disaster Monitor</h1>
        <p>Real-time natural event tracking</p>
      </header>
      
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

      {/* Conditionally render filters based on activeType */}
      {(activeType === 'earthquake' || activeType === 'cyclone' || activeType === 'flood') && (
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          showMagnitude={activeType === 'earthquake'}
          showTimeframe={true}
        />
      )}

      <div className="event-list">{renderContent()}</div>
    </aside>
  );
}