import React, { createContext, useReducer, useEffect } from 'react';
import api from '../config/api';
import setAuthToken from '../utils/setAuthToken';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    showProfileModal: false,
    localNotifications: []
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            setAuthToken(action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                showProfileModal: action.payload.user.profileCompleteness < 100
            };
        case 'PROFILE_UPDATE_SUCCESS':
            return {
                ...state,
                user: action.payload,
                showProfileModal: action.payload.profileCompleteness < 100
            };
        case 'HIDE_PROFILE_MODAL':
            return { ...state, showProfileModal: false };
        case 'LOGOUT':
            localStorage.removeItem('token');
            setAuthToken(null);
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                showProfileModal: false
            };
        case 'ADD_LOCAL_NOTIFICATION':
            return { ...state, localNotifications: [action.payload, ...state.localNotifications] };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user
    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token && token.trim() !== '') {
            setAuthToken(token);
            try {
                const res = await api.get('/auth/me');
                dispatch({ type: 'USER_LOADED', payload: res.data.data });
            } catch (err) {
                console.error('Failed to load user:', err);
                dispatch({ type: 'LOGOUT' });
            }
        } else {
            dispatch({ type: 'LOGOUT' });
        }
    };

    useEffect(() => {
        loadUser();
    }, []);
    
    const addLocalNotification = (message) => {
        dispatch({ type: 'ADD_LOCAL_NOTIFICATION', payload: {
            message,
            createdAt: new Date().toISOString(),
            read: false,
            _id: Math.random().toString(36).substr(2, 9)
        }});
    };

    const login = async (email, password) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({ email, password });
        try {
            const res = await api.post('/auth/login', body, config);
            if (!res || !res.data) throw new Error('No response from server');

            // For successful login (admin or regular user), dispatch login success and return user
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            // Removed notification for login
            return res.data.user;
        } catch (err) {
            console.error(err?.response?.data?.message || err.message);
            // Return error message for handling in component
            return { error: err?.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            const res = await api.post('/auth/register', userData, config);
            // API now returns email and internId (and may include emailError)
            const data = res.data || {};
            addLocalNotification(`Registration successful! Login ID: ${data.email || userData.email} | Intern ID: ${data.internId || 'Check your email/OTP'}`);
            return data;
        } catch (err) {
            // Improve logging for production debugging
            const url = err.config?.url || '/auth/register';
            const code = err.code || null;
            const status = err.response?.status || null;
            const serverMessage = err.response?.data?.message || null;
            console.error('Registration failed:', { url, code, status, serverMessage, message: err.message });

            // If this was a network error or timeout, try one retry with a longer timeout
            const isNetworkError = !err.response;
            const isTimeout = err.code === 'ECONNABORTED' || (err.message && err.message.includes('timeout'));

            if (isNetworkError || isTimeout) {
                try {
                    // Retry once with an increased timeout for this single request
                    const retryRes = await api.post('/auth/register', userData, { ...config, timeout: (process.env.REACT_APP_API_TIMEOUT ? parseInt(process.env.REACT_APP_API_TIMEOUT, 10) : 60000) * 2 });
                    const retryData = retryRes.data || {};
                    addLocalNotification(`Registration successful! Login ID: ${retryData.email || userData.email} | Intern ID: ${retryData.internId || 'Check your email/OTP'}`);
                    return retryData;
                } catch (retryErr) {
                    console.error('Retry registration failed:', retryErr.message || retryErr);
                    const message = retryErr.response?.data?.message || retryErr.message || 'Registration failed after retry';
                    const error = new Error(message);
                    error.response = retryErr.response;
                    throw error;
                }
            }

            // Surface the error to the calling component so it can display an appropriate message
            const message = serverMessage || err.message || 'Registration failed';
            const error = new Error(message);
            error.response = err.response;
            throw error;
        }
    };

    const updateUserProfile = async (profileData) => {
        try {
            const res = await api.put('/profile', profileData);
            dispatch({ type: 'PROFILE_UPDATE_SUCCESS', payload: res.data.data });
        } catch (err) {
            console.error('Profile update failed:', err);
        }
    };

    const hideProfileCompletionModal = () => dispatch({ type: 'HIDE_PROFILE_MODAL' });

    const logout = (arg) => {
        // Clear auth state
        dispatch({ type: 'LOGOUT' });

        // Legacy: if a function is passed, treat it as navigate and go to '/'
        if (typeof arg === 'function') {
            try {
                arg('/');
                return;
            } catch (err) {
                // fallback
            }
        }

        // If an options object is passed, allow controlling redirect behavior
        // Usage: logout({ navigate, redirectTo: '/login' }) or logout({ noRedirect: true })
        if (arg && typeof arg === 'object') {
            const { navigate, redirectTo, noRedirect } = arg;
            if (noRedirect) return;
            if (typeof navigate === 'function') {
                try {
                    navigate(redirectTo || '/');
                    return;
                } catch (err) {
                    // fallback to location
                }
            }
            if (redirectTo) {
                window.location.href = redirectTo;
                return;
            }
        }

        // Default: do a full page redirect to home
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, updateUserProfile, hideProfileCompletionModal, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 