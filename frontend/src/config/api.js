import axios from 'axios';

// Set base URL for axios
const baseURL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, '') + '/api'
  : process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://studenteramernbackend.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
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