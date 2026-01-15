import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Use relative path instead of full URL
  withCredentials: true,
});

export default api;