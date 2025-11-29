import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPrediction, getPredictionByName } from '../services/api';
import { 
  MapPin, Search, Navigation, CloudRain, Wind, AlertTriangle, Droplets, CheckCircle, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForecastPage() {
  const [locationName, setLocationName] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      logout().then(() => navigate('/login'));
    }
  };

  const handleGetByLocation = () => {
    setLoading(true);
    setError('');
    setPrediction(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await getPrediction(latitude, longitude);
          setPrediction(response.data);
        } catch (err) {
          handleAuthError(err);
          setError(err.response?.data?.error || "Network error. Is the backend running?");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve location.");
        setLoading(false);
      }
    );
  };

  const handleGetByName = async (e) => {
    e.preventDefault();
    if (!locationName) return;
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await getPredictionByName(locationName);
      setPrediction(response.data);
    } catch (err) {
      handleAuthError(err);
      setError(err.response?.data?.error || "Failed to fetch data. Check city name.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to pick color based on risk
  const getRiskColor = (level) => {
    switch(level) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Severe': 
      case 'Critical': // Added Critical for Cyclone
        return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="forecast-page">
      <div className="forecast-header">
        <h1>Risk Analysis Dashboard</h1>
        <p>Real-time predictive modeling for flood and cyclone impact.</p>
      </div>

      <div className="search-bar-container">
        <button 
          className="geo-button" 
          onClick={handleGetByLocation} 
          title="Use My Location"
          disabled={loading}
        >
          <Navigation size={20} />
        </button>
        <form onSubmit={handleGetByName} className="search-form">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by city (e.g., Mumbai, Chennai)" 
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="search-submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {prediction && (
        <div className="dashboard-grid">
          
          {/* Card 1: Location Info */}
          <div className="stat-card location-card">
            <div className="card-header">
              <MapPin size={18} className="text-blue-500" />
              <span>Identified Location</span>
            </div>
            <h3>{prediction.searched_location || "GPS Location"}</h3>
            <p className="sub-text">
              {prediction.found_location || `${prediction.latitude.toFixed(4)}, ${prediction.longitude.toFixed(4)}`}
            </p>
          </div>

          {/* Card 2: Rainfall Prediction */}
          <div className="stat-card">
            <div className="card-header">
              <CloudRain size={18} className="text-blue-600" />
              <span>Predicted Rainfall (24h)</span>
            </div>
            <div className="big-stat">
              {prediction.predicted_rainfall} <span className="unit">mm</span>
            </div>
            <p className="sub-text">Forecast for tomorrow</p>
          </div>

          {/* Card 3: Flood Risk Level */}
          <div className={`stat-card ${getRiskColor(prediction.flood_risk)}`}>
            <div className="card-header">
              <Droplets size={18} />
              <span>Flood Risk</span>
            </div>
            <div className="big-stat">{prediction.flood_risk}</div>
            <p className="risk-desc">{prediction.flood_message}</p>
          </div>

          {/* Card 4: Wind Speed (NEW) */}
          <div className="stat-card">
            <div className="card-header">
              <Wind size={18} className="text-gray-600" />
              <span>Wind Speed</span>
            </div>
            <div className="big-stat">
              {prediction.wind_speed} <span className="unit">km/h</span>
            </div>
            <p className="sub-text">Max wind forecast</p>
          </div>

          {/* Card 5: Cyclone Risk (NEW) */}
          <div className={`stat-card ${getRiskColor(prediction.cyclone_risk)}`}>
            <div className="card-header">
              <Zap size={18} />
              <span>Cyclone Risk</span>
            </div>
            <div className="big-stat">{prediction.cyclone_risk}</div>
            <p className="risk-desc">{prediction.cyclone_message}</p>
          </div>

        </div>
      )}
    </div>
  );
}