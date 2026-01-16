import api from './api';

export const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    // Store token in localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Store token in localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    // Remove token from localStorage
    localStorage.removeItem('token');
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};