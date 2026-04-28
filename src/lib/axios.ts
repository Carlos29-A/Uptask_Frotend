import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


// interceptor para agregar el token al header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
