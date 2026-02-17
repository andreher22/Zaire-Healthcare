import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Divider, List, ActivityIndicator, IconButton } from 'react-native-paper';
import { colors } from '../constants/colors';
import PacientesService from '../services/PacientesService';

const DetallePacienteScreen = ({ route, navigation }) => {
    const { pacienteId } = route.params;
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPaciente();
    }, []);

    const loadPaciente = async () => {
        try {
            const data = await PacientesService.getPaciente(pacienteId);
            setPaciente(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar la información del paciente');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await PacientesService.deletePaciente(pacienteId);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el paciente');
                        }
                    }
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.darkOliveGreen} />
            </View>
        );
    }

    if (!paciente) return null;

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card} mode="elevated">
                <Card.Title
                    title={paciente.nombre}
                    subtitle="Información Personal"
                    titleVariant="headlineSmall"
                    right={(props) => <IconButton {...props} icon="pencil" onPress={() => Alert.alert('Editar', 'Funcionalidad pendiente')} />}
                />
                <Card.Content>
                    <InfoRow label="Edad" value={`${paciente.edad} años`} />
                    <InfoRow label="Sexo" value={paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Otro'} />
                    <InfoRow label="Fecha Nac." value={paciente.fecha_nacimiento} />
                    <Divider style={styles.divider} />
                    <InfoRow label="Contacto" value={paciente.contacto || 'No registrado'} />
                    <InfoRow label="Dirección" value={paciente.direccion || 'No registrada'} />
                </Card.Content>
            </Card>

            <Text variant="titleMedium" style={styles.sectionTitle}>Acciones Rápidas</Text>

            <View style={styles.actionsGrid}>
                <Button
                    mode="contained"
                    icon="clipboard-text-clock"
                    style={styles.actionButton}
                    buttonColor={colors.darkOliveGreen}
                    onPress={() => navigation.navigate('Historial', { pacienteId: paciente.id })}
                >
                    Historial Clínico
                </Button>

                <Button
                    mode="contained"
                    icon="brain"
                    style={styles.actionButton}
                    buttonColor={colors.liver}
                    onPress={() => navigation.navigate('Diagnostico', { pacienteId: paciente.id })}
                >
                    Diagnóstico IA
                </Button>
            </View>

            <Button
                mode="outlined"
                icon="delete"
                style={styles.deleteButton}
                textColor={colors.error}
                onPress={handleEliminar}
            >
                Eliminar Paciente
            </Button>
        </ScrollView>
    );
};

const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: colors.white,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontWeight: 'bold',
        color: colors.darkGray,
        width: 100,
    },
    value: {
        color: colors.black,
        flex: 1,
    },
    divider: {
        marginVertical: 10,
    },
    sectionTitle: {
        color: colors.kombuGreen,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flex: 0.48,
        borderRadius: 8,
    },
    deleteButton: {
        borderColor: colors.error,
        marginBottom: 30,
    },
});

export default DetallePacienteScreen;
