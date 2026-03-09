/**
 * ZAIRE Healthcare — Dashboard Service
 * Servicio para obtener estadísticas y datos del dashboard.
 * @module DashboardService
 */
import api from './api';

const DashboardService = {
    /**
     * Obtener estadísticas del dashboard (pacientes, diagnósticos, pendientes).
     * @returns {Promise<Object>} Resumen con totales, datos semanales y actividad reciente.
     */
    getEstadisticas: async () => {
        try {
            const response = await api.get('auth/estadisticas/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener perfil del usuario autenticado.
     * @returns {Promise<Object>} Datos del usuario.
     */
    getPerfil: async () => {
        try {
            const response = await api.get('auth/perfil/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Actualizar perfil del usuario autenticado.
     * @param {Object} data - Datos a actualizar (nombre).
     * @returns {Promise<Object>} Respuesta con mensaje y datos actualizados.
     */
    updatePerfil: async (data) => {
        try {
            const response = await api.put('auth/perfil/', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default DashboardService;
