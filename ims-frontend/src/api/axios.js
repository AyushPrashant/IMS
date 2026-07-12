import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('ims_user') || 'null');
    if (user?.cookie) {
      config.headers.Authorization = `Bearer ${user.cookie}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message
      || error.response?.data
      || error.message
      || 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem('ims_user');
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please log in again.');
        setTimeout(() => { window.location.href = '/login'; }, 1000);
      }
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      // Let caller handle 404
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
