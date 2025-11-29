// src/utils/constants.js

export const INDIAN_BBOX = {
  minlatitude: 6,
  maxlatitude: 37.2,
  minlongitude: 68,
  maxlongitude: 97.5,
};

export const INDIA_CENTER = [22.5, 79];

export const DISASTER_TYPES = [
  { key: 'earthquake', label: 'Earthquakes' },
  { key: 'cyclone', label: 'Cyclones' },
  { key: 'flood', label: 'Floods' },
  
];

export const USGS_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';