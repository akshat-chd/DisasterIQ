// src/services/eonetApi.js

const EONET_API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';

export async function fetchEonetEvents({ category, days }) {
  const params = new URLSearchParams({
    category,
    days: String(days),
    status: 'all', // Fetch both open and closed events
    limit: '1000', // Increased limit to ensure we get all relevant global events
  });

  const response = await fetch(`${EONET_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`EONET API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.events) ? data.events : [];
}