import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    config => {
        // Add auth token if exists
        const token = localStorage.getItem('examToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    response => response.data,
    error => {
        // Handle errors globally
        const message = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject({ message, status: error.response?.status });
    }
);

export default api;
