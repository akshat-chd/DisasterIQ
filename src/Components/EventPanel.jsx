// src/components/EventPanel.jsx

import React from 'react';
import EventListItem from './EventListItem';
import Precautions from './Precautions';
import Loader from './Loader';

export default function EventPanel({
  isOpen,
  events,
  selectedEvent,
  setSelectedId
}) {
  const renderContent = () => {
    if (events.loading) return <Loader />;
    if (events.error === 'not_implemented') {
      return <div className="message">Data for this disaster type is not yet available.</div>;
    }
    if (events.error) {
      return <div className="message error">{events.error}</div>;
    }
    if (events.data.length === 0) {
      return <div className="message">No events found for the selected criteria.</div>;
    }
    return events.data.map((event) => (
      <EventListItem
        key={event.id}
        event={event}
        isSelected={selectedEvent?.id === event.id}
        onClick={() => setSelectedId(event.id)}
      />
    ));
  };

  return (
    <aside className={`event-panel ${isOpen ? 'open' : ''}`}>
      {selectedEvent ? (
        <Precautions event={selectedEvent} onBack={() => setSelectedId(null)} />
      ) : (
        <div className="event-list-container">
          <h2 className="panel-header">Recent Events</h2>
          <div className="event-list">{renderContent()}</div>
        </div>
      )}
    </aside>
  );
}