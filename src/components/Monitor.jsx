// src/components/Monitor.jsx

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import TopBar from './TopBar';
import EventPanel from './EventPanel';
import MapWrapper from './MapWrapper';
import ChatbotWidget from './ChatbotWidget';
import { useInterval } from '../hooks/useInterval';
import { fetchEarthquakes } from '../services/usgsApi';
import { fetchEonetEvents } from '../services/eonetApi';
import { INDIAN_BBOX } from '../utils/constants';

// --- CORRECT IMPORTS ---
import { getPrediction } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { PanelLeftClose, PanelLeftOpen, CloudHail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function Monitor() { 
  const [activeType, setActiveType] = useState('earthquake');
  const [filters, setFilters] = useState({ magMin: 2.5, days: 365 });
  const [events, setEvents] = useState({ data: [], loading: true, error: null });
  const [selectedId, setSelectedId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionAlert, setPredictionAlert] = useState(null); 
  
  const isInitialMount = useRef(true);

  // --- CORRECT: Auth and Navigation logic ---
  const { logout, user } = useAuth(); // Get both 'logout' and 'user'
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setEvents(e => ({ ...e, loading: true, error: null }));
    try {
      let rawData = [];
      let isImplemented = true;
      switch (activeType) {
        case 'earthquake': rawData = await fetchEarthquakes(filters); break;
        case 'cyclone': rawData = await fetchEonetEvents({ category: 'severeStorms', days: filters.days }); break;
        case 'flood': rawData = await fetchEonetEvents({ category: 'floods', days: filters.days }); break;
        // 'volcano' is removed from constants.js, so this case won't be hit
        default: isImplemented = false; // Set to false for any other type
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
  
  // --- CORRECT: Logout Handler ---
  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Navigate to login after logout
  };

  // --- UPDATED FORECAST FUNCTION ---
  const handleGetForecast = () => {
    setIsPredicting(true);
    setPredictionAlert(null);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsPredicting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await getPrediction(latitude, longitude);
          const data = response.data;
          setPredictionAlert(data);
          alert(data.alert_message);
          
        } catch (error) {
          console.error("Failed to get prediction:", error);
          let errorMsg = "Could not fetch prediction. Is the Python backend server running?";
          if (error.response?.status === 401) {
             errorMsg = "Your session expired. Please log in again.";
             handleLogout(); // Log them out if session is invalid
          }
          alert(errorMsg);
        } finally {
          setIsPredicting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please enable location services.");
        setIsPredicting(false);
      }
    );
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
        user={user} // <-- CORRECT: Pass user
        onLogout={handleLogout} // <-- CORRECT: Pass logout handler
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