// src/lib/api.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.thegrrrlsclub.de';

export { BASE_URL };

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    baseUrl: BASE_URL,
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    appName: import.meta.env.VITE_APP_NAME || 'The Grrrls Club'
  };
};
