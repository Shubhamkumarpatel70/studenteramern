import api from '../config/api';

const setAuthToken = token => {
    if (token && token.trim() !== '') {
        // Apply authorization token to every request if logged in
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        // Delete auth header
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

export default setAuthToken;
