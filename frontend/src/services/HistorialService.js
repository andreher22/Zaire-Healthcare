import api from './api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

const HistorialService = {
    // Obtener historial completo de un paciente
    getHistorial: async (pacienteId) => {
        try {
            const response = await api.get(`historial/${pacienteId}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Registrar un nuevo evento clínico
    createEvento: async (pacienteId, data) => {
        try {
            const response = await api.post(`historial/${pacienteId}/eventos/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Descargar PDF del historial
    downloadPDF: async (pacienteId, nombrePaciente) => {
        try {
            const filename = `Historial_${nombrePaciente.replace(/\s+/g, '_')}.pdf`;
            const result = await FileSystem.downloadAsync(
                `${api.defaults.baseURL}historial/${pacienteId}/pdf/`,
                FileSystem.documentDirectory + filename,
                {
                    headers: {
                        Authorization: api.defaults.headers.common['Authorization'],
                    },
                }
            );

            if (result.status === 200) {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(result.uri);
                } else {
                    Alert.alert('Descarga completada', `Archivo guardado en: ${result.uri}`);
                }
            } else {
                throw new Error('Error al descargar el PDF');
            }
        } catch (error) {
            console.error('Error descarga PDF:', error);
            Alert.alert('Error', 'No se pudo descargar el PDF del historial');
        }
    },
};

export default HistorialService;
