import { USGS_API_URL, INDIAN_BBOX } from '../utils/constants';

/**
 * Fetches earthquake data from the USGS API based on specified filters.
 * @param {object} filters - The filters for the API query.
 * @param {number} filters.days - The number of past days to fetch data for.
 * @param {number} filters.magMin - The minimum magnitude.
 * @returns {Promise<Array>} A promise that resolves to an array of earthquake features.
 */
export async function fetchEarthquakes({ days, magMin }) {
  const startTime = new Date(Date.now() - days * 86400000).toISOString();
  const endTime = new Date().toISOString();

  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startTime,
    endtime: endTime,
    minlatitude: INDIAN_BBOX.minlatitude,
    maxlatitude: INDIAN_BBOX.maxlatitude,
    minlongitude: INDIAN_BBOX.minlongitude,
    maxlongitude: INDIAN_BBOX.maxlongitude,
    minmagnitude: magMin,
    orderby: 'time',
    limit: '20000',
  });

  const response = await fetch(`${USGS_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.features) ? data.features : [];
}