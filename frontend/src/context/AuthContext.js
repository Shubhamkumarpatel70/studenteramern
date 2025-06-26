import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { toast } from 'react-toastify';

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
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            // This endpoint should be created to get user data from token
            // const res = await axios.get('/api/auth/me'); 
            // dispatch({ type: 'USER_LOADED', payload: res.data });
        } catch (err) {
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
            const res = await axios.post('/api/auth/login', body, config);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            // Removed notification for login
            return res.data.user;
        } catch (err) {
            console.error(err.response.data.message);
            return null;
        }
    };

    const register = async (userData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            const res = await axios.post('/api/auth/register', userData, config);
            // Add notification with login ID and intern ID (if available)
            addLocalNotification(`Registration successful! Login ID: ${res.data.user?.email || userData.email} | Intern ID: ${res.data.user?.internId || 'Check your email/OTP'}`);
            return res.data;
        } catch (err) {
            console.error('Registration failed:', err.response.data.message);
        }
    };

    const updateUserProfile = async (profileData) => {
        try {
            const res = await axios.put('/api/profile', profileData);
            dispatch({ type: 'PROFILE_UPDATE_SUCCESS', payload: res.data.data });
        } catch (err) {
            console.error('Profile update failed:', err);
        }
    };

    const hideProfileCompletionModal = () => dispatch({ type: 'HIDE_PROFILE_MODAL' });

    const logout = () => dispatch({ type: 'LOGOUT' });

    return (
        <AuthContext.Provider value={{ ...state, login, register, updateUserProfile, hideProfileCompletionModal, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 