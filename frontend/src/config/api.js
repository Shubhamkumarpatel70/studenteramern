import axios from 'axios';

// Set base URL for axios
// If REACT_APP_API_URL includes '/api' already, don't append another '/api'
let baseURL;
if (process.env.REACT_APP_API_URL) {
  const cleaned = process.env.REACT_APP_API_URL.replace(/\/$/, '');
  baseURL = cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
} else if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:5000/api';
} else {
  // In production, prefer a relative path so the frontend talks to the same origin
  // backend (for example when deployed together to Vercel and routed via /api).
  // If you deploy frontend and backend separately and need an absolute URL,
  // set REACT_APP_API_URL in your environment instead.
  baseURL = '/api';
}

// Log the baseURL for easier debugging in dev or when explicitly enabled in production
if (process.env.NODE_ENV !== 'production' || process.env.REACT_APP_DEBUG_API === 'true') {
  // eslint-disable-next-line no-console
  console.info('API baseURL:', baseURL);
  // eslint-disable-next-line no-console
  console.info('API timeout (ms):', process.env.REACT_APP_API_TIMEOUT || 60000);
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: baseURL,
  // Set a reasonable timeout. If your backend legitimately needs more time for
  // registration (e.g. heavy processing), increase this via REACT_APP_API_TIMEOUT.
  timeout: process.env.REACT_APP_API_TIMEOUT
    ? parseInt(process.env.REACT_APP_API_TIMEOUT, 10)
    : 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        // Handle unauthorized access: dispatch an event so the React Router
        // can perform a client-side navigation without forcing a full page reload
        // (which can cause a 404 on static hosts when requesting e.g. /login).
        localStorage.removeItem('token');
        try {
          window.dispatchEvent(new Event('unauthorized'));
        } catch (e) {
          // Fallback to full navigation if dispatching the event fails for some reason
          window.location.href = '/login';
        }
    }
    return Promise.reject(error);
  }
);

export default api; 