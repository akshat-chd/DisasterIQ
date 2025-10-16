// src/components/MapWrapper.jsx

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { INDIA_CENTER } from '../utils/constants';
import { getEventColor, formatIST } from '../utils/helpers';

function MapFlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapWrapper({ events, selectedId, setSelectedId }) {
  const selectedEvent = useMemo(() => {
    return events.find(event => event.id === selectedId) || null;
  }, [events, selectedId]);

  return (
    <MapContainer center={INDIA_CENTER} zoom={5} className="map-container">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {events.map(event => {
        const color = getEventColor(event.type, event.details.mag);
        const radius = event.type === 'earthquake'
            ? Math.max(4, event.details.mag * 2.5)
            : 10; // Fixed radius for cyclones and floods

        return (
          <CircleMarker
            key={event.id}
            center={[event.lat, event.lng]}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              weight: 1,
              fillOpacity: 0.7,
            }}
            eventHandlers={{
              click: () => {
                setSelectedId(event.id);
              },
            }}
          >
            <Popup>
              <div className="popup-content">
                <h3>
                  {event.type === 'earthquake' ? `M ${event.details.mag.toFixed(1)}` : event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </h3>
                <p className="place">{event.title}</p>
                <p className="time">{formatIST(event.time)}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {selectedEvent && <MapFlyTo center={[selectedEvent.lat, selectedEvent.lng]} zoom={7} />}
    </MapContainer>
  );
}