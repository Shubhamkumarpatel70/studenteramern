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
  baseURL = 'https://studenteramernbackend.onrender.com/api';
}

// Log the baseURL for easier debugging in dev
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.info('API baseURL:', baseURL);
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: baseURL,
  // Increase timeout to allow for slower network/email send operations during registration
  timeout: 120000,
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