import axios from 'axios'

// Use environment variable for API URL, fallback to relative URL for development proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // QUAN TRỌNG để browser tự đính cookie
})

