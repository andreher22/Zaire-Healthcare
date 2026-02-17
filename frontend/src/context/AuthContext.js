import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar si hay sesión activa al iniciar
    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            if (token) {
                // Opcional: Validar token con el backend o decodificarlo
                // Por MVP, asumimos que si hay token, hay sesión (el interceptor 401 lo borrará si es inválido)
                const userData = await AsyncStorage.getItem('user_data');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            }
        } catch (e) {
            console.log('Error al cargar sesión:', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (correo, password) => {
        try {
            const response = await api.post('auth/login/', { correo, password });

            const { tokens, usuario } = response.data;

            await AsyncStorage.setItem(TOKEN_KEY, tokens.access);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
            await AsyncStorage.setItem('user_data', JSON.stringify(usuario));

            setUser(usuario);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.non_field_errors?.[0] || 'Error al iniciar sesión'
            };
        }
    };

    const logout = async () => {
        try {
            const refresh = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            if (refresh) {
                await api.post('auth/logout/', { refresh });
            }
        } catch (e) {
            console.log('Error logout API:', e);
        } finally {
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
            await AsyncStorage.removeItem('user_data');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
