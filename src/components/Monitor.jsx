// src/components/monitor.jsx

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import TopBar from './TopBar';
import EventPanel from './EventPanel';
import MapWrapper from './MapWrapper';
import ChatbotWidget from './ChatbotWidget';
import { useInterval } from '../hooks/useInterval';
import { fetchEarthquakes } from '../services/usgsApi';
import { fetchEonetEvents } from '../services/eonetApi';
import { INDIAN_BBOX } from '../utils/constants';
// --- ADDED IMPORTS ---
import { fetchRainfallPrediction } from '../services/predictionApi'; // The new service for your ML backend
import { PanelLeftClose, PanelLeftOpen, CloudHail } from 'lucide-react'; // Added CloudHail icon

const isCoordInIndia = (lat, lng) => (
  lat >= INDIAN_BBOX.minlatitude && lat <= INDIAN_BBOX.maxlatitude &&
  lng >= INDIAN_BBOX.minlongitude && lng <= INDIAN_BBOX.maxlongitude
);

const mapEventData = (event, type) => {
  if (type === 'earthquake') {
    const [lng, lat] = event.geometry.coordinates;
    return { id: event.id, type, title: event.properties.place, time: event.properties.time, lat, lng, details: { mag: event.properties.mag } };
  }
  if (type === 'cyclone' || type === 'flood') {
    const geometry = event.geometry.find(g => isCoordInIndia(g.coordinates[1], g.coordinates[0]));
    if (!geometry) return null;
    const [lng, lat] = geometry.coordinates;
    return { id: event.id, type, title: event.title, time: geometry.date, lat, lng, details: {} };
  }
  return null;
};

// The function name is correctly "Monitor"
export default function Monitor() { 
  const [activeType, setActiveType] = useState('earthquake');
  const [filters, setFilters] = useState({ magMin: 2.5, days: 365 });
  const [events, setEvents] = useState({ data: [], loading: true, error: null });
  const [selectedId, setSelectedId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  // --- ADDED STATE FOR ML PREDICTION ---
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionValue, setPredictionValue] = useState(null);
  
  const isInitialMount = useRef(true);

  const loadData = useCallback(async () => {
    // ... (this function remains the same)
    setEvents(e => ({ ...e, loading: true, error: null }));
    try {
      let rawData = [];
      let isImplemented = true;
      switch (activeType) {
        case 'earthquake': rawData = await fetchEarthquakes(filters); break;
        case 'cyclone': rawData = await fetchEonetEvents({ category: 'severeStorms', days: filters.days }); break;
        case 'flood': rawData = await fetchEonetEvents({ category: 'floods', days: filters.days }); break;
        case 'volcano': isImplemented = false; break;
        default: throw new Error(`Unknown type: ${activeType}`);
      }
      
      const mappedData = rawData.map(event => mapEventData(event, activeType)).filter(Boolean);
      
      if (!isImplemented) {
        setEvents({ data: [], loading: false, error: 'not_implemented' });
      } else {
        setEvents({ data: mappedData, loading: false, error: null });
      }
    } catch (err) {
      setEvents({ data: [], loading: false, error: 'Failed to fetch data.' });
      console.error(err);
    }
  }, [activeType, filters]);

  // --- ADDED FUNCTION TO CALL YOUR PYTHON BACKEND ---
  const handleGetForecast = async () => {
    setIsPredicting(true);
    setPredictionValue(null);
    try {
      // NOTE: These are dummy values for testing.
      const currentConditions = {
        temp: 29.5,
        humidity: 85,
        pressure: 1004,
        wind_speed: 12,
        rainfall_today: 2.5,
      };
      
      const data = await fetchRainfallPrediction(currentConditions);
      setPredictionValue(data.predicted_rainfall_mm);
      alert(`Forecasted rainfall for tomorrow: ${data.predicted_rainfall_mm} mm`);

    } catch (error) {
      console.error("Failed to get prediction:", error);
      alert("Could not fetch prediction. Is the Python backend server running?");
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadData();
      return;
    }
    loadData();
  }, [loadData]);

  useInterval(loadData, 300000);

  const selectedEvent = useMemo(() => {
    return events.data.find(event => event.id === selectedId) || null;
  }, [events.data, selectedId]);

  useEffect(() => {
    if (selectedId) {
      setIsPanelOpen(true);
      const element = document.getElementById(`event-${selectedId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedId]);

  return (
    <div className="app-container">
      <TopBar
        activeType={activeType}
        setActiveType={setActiveType}
        filters={filters}
        setFilters={setFilters}
      />
      <main className="main-content">
        <EventPanel
          isOpen={isPanelOpen}
          events={events}
          selectedEvent={selectedEvent}
          setSelectedId={setSelectedId}
        />
        <div className="map-area">
          <button className="panel-toggle" onClick={() => setIsPanelOpen(s => !s)}>
            {isPanelOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>

          {/* --- ADDED THE FORECAST BUTTON --- */}
          <button className="forecast-button" onClick={handleGetForecast} disabled={isPredicting}>
            {isPredicting ? "..." : <CloudHail size={20} />}
          </button>

          <MapWrapper events={events.data} selectedId={selectedId} setSelectedId={setSelectedId} />
        </div>
      </main>
      <ChatbotWidget />
    </div>
  );
}