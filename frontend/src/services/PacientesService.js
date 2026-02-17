import api from './api';

const PacientesService = {
    // Obtener lista de pacientes con filtros opcionales
    getPacientes: async (params = {}) => {
        try {
            const response = await api.get('pacientes/', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener detalle de un paciente
    getPaciente: async (id) => {
        try {
            const response = await api.get(`pacientes/${id}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Crear un nuevo paciente
    createPaciente: async (data) => {
        try {
            const response = await api.post('pacientes/', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Actualizar un paciente
    updatePaciente: async (id, data) => {
        try {
            const response = await api.put(`pacientes/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Eliminar un paciente
    deletePaciente: async (id) => {
        try {
            await api.delete(`pacientes/${id}/`);
            return true;
        } catch (error) {
            throw error;
        }
    },
};

export default PacientesService;
