import axios from 'axios';
import Cookies from 'js-cookie';

// base URL - Fixed to use correct env variable
const API_BASE_URL = import.meta.env.VITE_API_FULL_URL || 'http://localhost:8000/flower-arrangements/api/v1.0';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// add access token
api.interceptors.request.use((config) => {
    const accessToken = Cookies.get('accessToken'); // Fixed: use accessToken
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
});

// auth APIs
export const authAPIs = {

    // user endpoints
    userRegister: async (userData) => {
        const response = await api.post('/user/register', userData);
        return response.data;
    },

    userLogin: async (userData) => {
        const response = await api.post('/user/login', userData);
        return response.data;
    },

    // admin endpoints
    adminRegister: async (userData) => {
        const response = await api.post('/admin/register', userData);
        return response.data;
    },

    adminLogin: async (userData) => {
        const response = await api.post('/admin/login', userData);
        return response.data;
    },
}

export const fileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.onerror = (error) => {
            reject(error);
        }
    });
}

export default api;
