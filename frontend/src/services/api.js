import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, TOKEN_KEY } from '../constants/config';

// Crear instancia de Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores (401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Aquí se podría implementar la lógica de refresh token
            // Por ahora, simplemente rechazamos y el AuthContext manejará el logout
            await AsyncStorage.removeItem(TOKEN_KEY);
        }
        return Promise.reject(error);
    }
);

export default api;
