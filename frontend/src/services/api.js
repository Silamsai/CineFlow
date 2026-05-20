import axios from 'axios';

// Priority: VITE_API_URL → VITE_API_BASE_URL → production Render URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://cineflow-backend-fnn5.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('cineflow_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cineflow_token');
      localStorage.removeItem('cineflow_user');
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
