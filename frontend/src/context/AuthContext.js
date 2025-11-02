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
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            try {
                const res = await api.get('/auth/me');
                dispatch({ type: 'USER_LOADED', payload: res.data.data });
            } catch (err) {
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
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            // Removed notification for login
            return res.data.user;
        } catch (err) {
            console.error(err?.response?.data?.message || err.message);
            return null;
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
            console.error('Registration failed:', err.response?.data?.message || err.message);
            // If user already exists, throw error to be handled by component
            if (err.response?.data?.message?.includes('already exists')) {
                throw err;
            }
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

    const logout = () => dispatch({ type: 'LOGOUT' });

    return (
        <AuthContext.Provider value={{ ...state, login, register, updateUserProfile, hideProfileCompletionModal, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 