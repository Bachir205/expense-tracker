import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      // Server responded with error status
      if (err.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (err.request) {
      // Network error - no response received
      console.error('Network error: Backend may be unreachable');
      // Could trigger a toast notification here
    }
    return Promise.reject(err);
  }
);

export default api;
