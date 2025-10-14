// src/utils/helpers.js

export function getEventColor(type, mag) {
  switch (type) {
    case 'earthquake':
      if (mag >= 5.5) return '#b91c1c'; // Red-700
      if (mag >= 4.5) return '#ef4444'; // Red-500
      if (mag >= 3.0) return '#f97316'; // Orange-500
      return '#4f46e5'; // Indigo-600
    case 'cyclone':
      return '#0e7490'; // Cyan-700
    case 'flood':
      return '#1d4ed8'; // Blue-700
    default:
      return '#6b7280'; // Gray-500
  }
}

export function formatIST(timestamp) {
  try {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/KKolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return 'Invalid Date';
  }
}