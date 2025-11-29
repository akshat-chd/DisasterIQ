// src/components/TopBar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { DISASTER_TYPES } from '../utils/constants';
import Filters from './Filters';
import { ShieldAlert, User, LogOut } from 'lucide-react';

export default function TopBar({ activeType, setActiveType, filters, setFilters, onLogout, user }) {
  const location = useLocation();
  const isMapPage = location.pathname === '/';

  const handleFilterChange = (key, value) => {
    setFilters(currentFilters => ({ ...currentFilters, [key]: value }));
  };

  return (
    <header className="top-bar">
      
      <div className="top-bar-left">
        <div className="logo-section">
          <ShieldAlert size={28} className="logo-icon" />
          <div className="logo-text">
            {/* Clicking the Logo takes you back to the Map (Home) */}
            <Link to="/"><h1>Disaster Monitor</h1></Link>
            <p>Real-time Event Tracking</p>
          </div>
        </div>
        
        {/* --- 1. Navigation (Live Map text removed) --- */}
        <nav className="nav-links">
          <Link 
            to="/predictions" 
            className={`nav-link ${!isMapPage ? 'active' : ''}`}
          >
            Predictions
          </Link>
        </nav>

        {/* --- 2. Disaster Type Switcher (Only visible on Map Page) --- */}
        {isMapPage && (
          <>
            <div className="divider-vertical"></div>
            <nav className="disaster-tabs">
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
          </>
        )}
      </div>

      <div className="top-bar-right">
        {/* 3. Filters (Only visible on Map Page) */}
        {isMapPage && (
          <div className="filters-section">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              showMagnitude={activeType === 'earthquake'}
              showTimeframe={true}
            />
          </div>
        )}

        <div className="user-dropdown">
          <div className="user-icon"><User size={22} /></div>
          <div className="dropdown-content">
            <button onClick={onLogout} className="logout-button">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
      </div>
    </header>
  );
}