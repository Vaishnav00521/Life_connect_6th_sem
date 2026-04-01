// src/utils/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || BASE_URL.replace(/^http/, 'ws');

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // We don't automatically parse JSON here because some endpoints (like /register) 
    // might return a plain string or trigger a 400 Bad Request which we need to handle individually.
    return response;
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
};

export const getApiBaseUrl = () => BASE_URL;
export const getWsBaseUrl = () => `${WS_BASE_URL}/ws-lifeconnect`;
