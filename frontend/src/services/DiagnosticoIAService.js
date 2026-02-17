import api from './api';

const DiagnosticoIAService = {
    // Obtener lista de síntomas disponibles
    getSintomas: async () => {
        try {
            const response = await api.get('diagnostico/sintomas/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Enviar síntomas para predicción
    predecir: async (data) => {
        try {
            // data debe ser { sintomas: ["sintoma1", "sintoma2"] }
            const response = await api.post('diagnostico/predecir/', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener historial de diagnósticos
    getHistorial: async () => {
        try {
            const response = await api.get('diagnostico/historial/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default DiagnosticoIAService;
