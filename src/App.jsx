// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Monitor from './components/Monitor.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- 1. Import the new page ---
import PredictionsPage from './pages/PredictionsPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Monitor />} />
        
        {/* --- 2. Add the new route --- */}
        <Route path="/predictions" element={<PredictionsPage />} />
      </Route>
    </Routes>
  );
}