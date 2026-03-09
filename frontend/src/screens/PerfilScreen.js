/**
 * ZAIRE Healthcare — PerfilScreen
 * Pantalla de perfil del usuario con edición de nombre.
 * Muestra avatar grande, rol, fecha de registro, y formulario de edición.
 */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { Text, TextInput, Button, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';
import DashboardService from '../services/DashboardService';
import LoadingSpinner from '../components/LoadingSpinner';

const PerfilScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [perfil, setPerfil] = useState(null);
    const [nombre, setNombre] = useState('');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPerfil();
    }, []);

    /** Cargar datos del perfil desde la API. */
    const loadPerfil = async () => {
        try {
            const data = await DashboardService.getPerfil();
            setPerfil(data);
            setNombre(data.nombre);
        } catch (error) {
            console.error('Error cargando perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    /** Guardar cambios del perfil. */
    const handleSave = async () => {
        if (nombre.trim().length < 3) {
            Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres.');
            return;
        }
        setSaving(true);
        try {
            const data = await DashboardService.updatePerfil({ nombre: nombre.trim() });
            setPerfil(data.usuario);
            setEditing(false);
            Alert.alert('Éxito', 'Perfil actualizado correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el perfil.');
        } finally {
            setSaving(false);
        }
    };

    /** Obtener iniciales del nombre. */
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
    };

    /** Formatear rol del usuario. */
    const getRolLabel = (rol) => {
        const roles = {
            admin: 'Administrador',
            medico: 'Médico',
            enfermero: 'Enfermero',
        };
        return roles[rol] || rol;
    };

    if (loading) return <LoadingSpinner message="Cargando perfil..." />;

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                {/* Avatar grande */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarTextLarge}>{getInitials(perfil?.nombre)}</Text>
                    </View>
                    <Text style={styles.name}>{perfil?.nombre}</Text>
                    <View style={styles.rolBadge}>
                        <MaterialCommunityIcons name="shield-check" size={16} color={colors.darkOliveGreen} />
                        <Text style={styles.rolText}>{getRolLabel(perfil?.rol)}</Text>
                    </View>
                </View>

                <Surface style={styles.card} elevation={2}>
                    <Text style={styles.cardTitle}>Información de la Cuenta</Text>
                    <Divider style={styles.divider} />

                    <InfoRow
                        icon="email-outline"
                        label="Correo"
                        value={perfil?.correo}
                    />
                    <InfoRow
                        icon="calendar-clock"
                        label="Miembro desde"
                        value={perfil?.fecha_creacion ? new Date(perfil.fecha_creacion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    />
                    <InfoRow
                        icon="update"
                        label="Última actualización"
                        value={perfil?.fecha_actualizacion ? new Date(perfil.fecha_actualizacion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    />
                    <InfoRow
                        icon="check-circle-outline"
                        label="Estado"
                        value={perfil?.is_active ? 'Activo' : 'Inactivo'}
                    />
                </Surface>

                <Surface style={styles.card} elevation={2}>
                    <Text style={styles.cardTitle}>Editar Perfil</Text>
                    <Divider style={styles.divider} />

                    <TextInput
                        label="Nombre completo"
                        value={nombre}
                        onChangeText={setNombre}
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor={colors.darkOliveGreen}
                        disabled={!editing}
                    />

                    {editing ? (
                        <View style={styles.editActions}>
                            <Button
                                mode="outlined"
                                onPress={() => { setEditing(false); setNombre(perfil?.nombre || ''); }}
                                style={styles.cancelBtn}
                                textColor={colors.darkGray}
                            >
                                Cancelar
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSave}
                                loading={saving}
                                disabled={saving}
                                buttonColor={colors.darkOliveGreen}
                                style={styles.saveBtn}
                            >
                                Guardar
                            </Button>
                        </View>
                    ) : (
                        <Button
                            mode="contained"
                            onPress={() => setEditing(true)}
                            buttonColor={colors.darkOliveGreen}
                            icon="pencil"
                            style={styles.editBtn}
                        >
                            Editar Nombre
                        </Button>
                    )}
                </Surface>
            </View>
        </ScrollView>
    );
};

/** Fila de información reutilizable. */
const InfoRow = ({ icon, label, value }) => (
    <View style={infoStyles.row}>
        <MaterialCommunityIcons name={icon} size={22} color={colors.fawn} style={infoStyles.icon} />
        <View style={infoStyles.textContainer}>
            <Text style={infoStyles.label}>{label}</Text>
            <Text style={infoStyles.value}>{value}</Text>
        </View>
    </View>
);

const infoStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    icon: {
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: colors.darkGray,
    },
    value: {
        fontSize: 15,
        color: colors.kombuGreen,
        fontWeight: '500',
        marginTop: 2,
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
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    avatarLarge: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: colors.darkOliveGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    avatarTextLarge: {
        color: colors.white,
        fontSize: 36,
        fontWeight: '700',
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.kombuGreen,
    },
    rolBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkOliveGreen + '15',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
    },
    rolText: {
        fontSize: 13,
        color: colors.darkOliveGreen,
        fontWeight: '600',
        marginLeft: 6,
    },
    card: {
        borderRadius: 16,
        backgroundColor: colors.white,
        padding: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginBottom: 4,
    },
    divider: {
        marginVertical: 12,
    },
    input: {
        backgroundColor: colors.white,
        marginBottom: 16,
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancelBtn: {
        marginRight: 10,
    },
    saveBtn: {},
    editBtn: {
        alignSelf: 'flex-start',
    },
});

export default PerfilScreen;
