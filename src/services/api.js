// src/services/api.js
import axios from 'axios';

// Create an 'instance' of axios.
const api = axios.create({
  baseURL: 'https://disaster-backend-ieoa.onrender.com', // Your Flask backend address
  withCredentials: true,
});

// --- Auth Functions ---
export const checkAuthStatus = () => api.get('/@me');
export const login = (username, password) => api.post('/login', { username, password });
export const register = (username, password) => api.post('/register', { username, password });
export const logout = () => api.post('/logout');

// --- Prediction Functions ---

// This one is for (lat, lon)
export const getPrediction = (latitude, longitude) => {
  return api.post('/predict', { latitude, longitude });
};

// --- THIS IS THE CORRECTED FUNCTION ---
export const getPredictionByName = (location_name) => {
  return api.post('/predict_by_name', { location_name }); // Has underscore
};