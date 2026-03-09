/**
 * ZAIRE Healthcare — DetallePacienteScreen
 * Vista detallada de un paciente con información personal,
 * acciones rápidas (historial, diagnóstico IA) y edición.
 * Diseño responsive con maxWidth en desktop.
 */
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import {
    Text, Button, Surface, Divider, IconButton, ActivityIndicator
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import PacientesService from '../services/PacientesService';

const DetallePacienteScreen = ({ route, navigation }) => {
    const { pacienteId } = route.params;
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPaciente();
    }, []);

    /** Cargar datos del paciente. */
    const loadPaciente = async () => {
        try {
            const data = await PacientesService.getPaciente(pacienteId);
            setPaciente(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar la información del paciente.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    /** Confirmar y eliminar paciente. */
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
                            Alert.alert('Eliminado', 'El paciente ha sido eliminado.');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el paciente.');
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
            <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                {/* Avatar + Nombre */}
                <View style={styles.profileSection}>
                    <View style={[styles.avatar, { backgroundColor: paciente.sexo === 'F' ? colors.fawn + '25' : colors.darkOliveGreen + '18' }]}>
                        <MaterialCommunityIcons
                            name={paciente.sexo === 'F' ? 'face-woman' : 'face-man'}
                            size={40}
                            color={paciente.sexo === 'F' ? colors.fawn : colors.darkOliveGreen}
                        />
                    </View>
                    <Text style={styles.nombre}>{paciente.nombre}</Text>
                    <Text style={styles.subtitulo}>
                        {paciente.edad} años • {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Otro'}
                    </Text>
                </View>

                {/* Información Personal */}
                <Surface style={styles.card} elevation={2}>
                    <Text style={styles.cardTitle}>Información Personal</Text>
                    <Divider style={styles.divider} />
                    <InfoRow icon="cake-variant" label="Fecha Nac." value={paciente.fecha_nacimiento || '—'} />
                    <InfoRow icon="phone" label="Contacto" value={paciente.contacto || 'No registrado'} />
                    <InfoRow icon="map-marker" label="Dirección" value={paciente.direccion || 'No registrada'} />
                    <InfoRow icon="doctor" label="Médico" value={paciente.nombre_medico || '—'} />
                    <InfoRow icon="calendar-plus" label="Registro" value={
                        paciente.fecha_registro
                            ? new Date(paciente.fecha_registro).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                            : '—'
                    } />
                </Surface>

                {/* Acciones Rápidas */}
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.actionsGrid}>
                    <ActionCard
                        icon="clipboard-text-clock"
                        label="Historial Clínico"
                        color={colors.darkOliveGreen}
                        onPress={() => navigation.navigate('Historial', { pacienteId: paciente.id })}
                    />
                    <ActionCard
                        icon="brain"
                        label="Diagnóstico IA"
                        color={colors.liver}
                        onPress={() => navigation.navigate('Diagnostico', { pacienteId: paciente.id })}
                    />
                </View>

                {/* Eliminar */}
                <Button
                    mode="outlined"
                    icon="delete-outline"
                    style={styles.deleteButton}
                    textColor={colors.error}
                    onPress={handleEliminar}
                >
                    Eliminar Paciente
                </Button>
            </View>
        </ScrollView>
    );
};

/** Fila de información reutilizable. */
const InfoRow = ({ icon, label, value }) => (
    <View style={infoStyles.row}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.fawn} style={infoStyles.icon} />
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
    </View>
);

/** Card de acción rápida. */
const ActionCard = ({ icon, label, color, onPress }) => (
    <Surface style={actionStyles.card} elevation={2}>
        <Button
            mode="contained"
            icon={icon}
            buttonColor={color}
            onPress={onPress}
            style={actionStyles.button}
            contentStyle={actionStyles.buttonContent}
            labelStyle={actionStyles.label}
        >
            {label}
        </Button>
    </Surface>
);

const infoStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    icon: {
        marginRight: 12,
    },
    label: {
        fontWeight: '600',
        color: colors.darkGray,
        width: 90,
        fontSize: 13,
    },
    value: {
        color: colors.kombuGreen,
        flex: 1,
        fontSize: 14,
    },
});

const actionStyles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
        marginHorizontal: 4,
        backgroundColor: colors.white,
    },
    button: {
        borderRadius: 14,
    },
    buttonContent: {
        paddingVertical: 14,
    },
    label: {
        fontSize: 13,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    contentDesktop: {
        maxWidth: 650,
        alignSelf: 'center',
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Profile
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    nombre: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.kombuGreen,
    },
    subtitulo: {
        fontSize: 14,
        color: colors.darkGray,
        marginTop: 4,
    },

    // Card
    card: {
        borderRadius: 16,
        backgroundColor: colors.white,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.kombuGreen,
    },
    divider: {
        marginVertical: 10,
    },

    // Section
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginBottom: 12,
    },
    actionsGrid: {
        flexDirection: 'row',
        marginBottom: 24,
    },

    // Delete
    deleteButton: {
        borderColor: colors.error,
        marginBottom: 30,
        borderRadius: 12,
    },
});

export default DetallePacienteScreen;
