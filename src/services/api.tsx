import axios from 'axios'

// Use environment variable for API URL, fallback to relative URL for development proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // QUAN TRỌNG để browser tự đính cookie
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            withCredentials: config.withCredentials,
            headers: config.headers,
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        
        // Handle 403 errors specifically
        if (error.response?.status === 403) {
            console.error('403 Forbidden - Authentication/Authorization issue');
            // You might want to redirect to login or show a specific message
        }
        
        return Promise.reject(error);
    }
);

