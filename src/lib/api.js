// base URL
import axios from "axios";
import {Cookie} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_FILE_URL || 'http://localhost:8000/flower-arrangements/api/v1.0';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// add access token
api.interceptors.request.use((config) => {
    const accessToken = Cookie.get('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
});

// auth APIs
export const authAPIs = {
    userRegister: async (userData) => {
        const response = await api.post('/user/register', userData);
        return response.data;
    }
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
