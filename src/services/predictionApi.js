// src/services/predictionApi.js

const ML_API_URL = 'http://127.0.0.1:8000'; // The address of your Python backend

/**
 * Fetches rainfall prediction from the ML backend.
 * @param {object} currentConditions - The current weather data.
 * @returns {Promise<object>} A promise that resolves to the prediction data.
 */
export async function fetchRainfallPrediction(currentConditions) {
  const { temp, humidity, pressure, wind_speed, rainfall_today } = currentConditions;

  const params = new URLSearchParams({
    temp,
    humidity,
    pressure,
    wind_speed,
    rainfall_today,
  });

  const response = await fetch(`${ML_API_URL}/predict?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch prediction');
  }

  return response.json();
}