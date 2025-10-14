// src/components/EventListItem.jsx

import React from 'react';
import { getEventColor } from '../utils/helpers';
import { Zap, Droplets, Waves } from 'lucide-react';

const EventIcon = ({ type }) => {
  const commonProps = { size: 20, className: 'event-icon' };
  switch (type) {
    case 'earthquake': return <Zap {...commonProps} />;
    case 'cyclone': return <Waves {...commonProps} />;
    case 'flood': return <Droplets {...commonProps} />;
    default: return null;
  }
};

export default function EventListItem({ event, isSelected, onClick }) {
  const eventColor = getEventColor(event.type, event.details.mag);

  return (
    <div
      id={`event-${event.id}`}
      className={`event-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="event-icon-container" style={{ backgroundColor: eventColor }}>
        <EventIcon type={event.type} />
      </div>
      <div className="event-details">
        <div className="event-item-header">
          <span className="event-descriptor">
            {event.type === 'earthquake'
              ? `M ${event.details.mag.toFixed(1)} Earthquake`
              : event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
          <span className="time">
            {new Date(event.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <div className="event-item-place">{event.title}</div>
      </div>
    </div>
  );
}