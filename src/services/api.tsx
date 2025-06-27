import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:1010/api', // Địa chỉ API của bạn
    withCredentials: true, // QUAN TRỌNG để browser tự đính cookie
})

