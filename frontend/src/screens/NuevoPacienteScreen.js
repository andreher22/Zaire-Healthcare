/**
 * ZAIRE Healthcare — NuevoPacienteScreen (Registro de Paciente)
 * Formulario de registro de pacientes con validación y diseño responsive.
 */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { TextInput, Button, RadioButton, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import PacientesService from '../services/PacientesService';

const NuevoPacienteScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [sexo, setSexo] = useState('M');
    const [contacto, setContacto] = useState('');
    const [direccion, setDireccion] = useState('');
    const [loading, setLoading] = useState(false);

    /** Validar y guardar paciente. */
    const handleGuardar = async () => {
        // Validaciones
        if (!nombre.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio.');
            return;
        }
        if (nombre.trim().length < 3) {
            Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres.');
            return;
        }
        if (!fechaNacimiento) {
            Alert.alert('Error', 'La fecha de nacimiento es obligatoria.');
            return;
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fechaNacimiento)) {
            Alert.alert('Error', 'Formato de fecha inválido. Use AAAA-MM-DD (ej: 1990-05-15)');
            return;
        }
        // Validar que la fecha sea válida y no futura
        const date = new Date(fechaNacimiento);
        if (isNaN(date.getTime())) {
            Alert.alert('Error', 'La fecha ingresada no es válida.');
            return;
        }
        if (date > new Date()) {
            Alert.alert('Error', 'La fecha de nacimiento no puede ser futura.');
            return;
        }

        setLoading(true);
        try {
            await PacientesService.createPaciente({
                nombre: nombre.trim(),
                fecha_nacimiento: fechaNacimiento,
                sexo,
                contacto: contacto.trim(),
                direccion: direccion.trim(),
            });
            Alert.alert('Éxito', 'Paciente registrado correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            const msg = error.response?.data?.nombre?.[0] || 'No se pudo registrar el paciente.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                <Surface style={styles.card} elevation={2}>
                    <View style={styles.header}>
                        <MaterialCommunityIcons name="account-plus" size={28} color={colors.darkOliveGreen} />
                        <Text style={styles.title}>Registrar Nuevo Paciente</Text>
                    </View>

                    <TextInput
                        label="Nombre Completo *"
                        value={nombre}
                        onChangeText={setNombre}
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor={colors.darkOliveGreen}
                        left={<TextInput.Icon icon="account" />}
                    />

                    <TextInput
                        label="Fecha de Nacimiento (AAAA-MM-DD) *"
                        value={fechaNacimiento}
                        onChangeText={setFechaNacimiento}
                        mode="outlined"
                        placeholder="Ej: 1990-05-15"
                        style={styles.input}
                        activeOutlineColor={colors.darkOliveGreen}
                        keyboardType="numeric"
                        left={<TextInput.Icon icon="calendar" />}
                    />

                    <Text style={styles.label}>Sexo</Text>
                    <RadioButton.Group onValueChange={setSexo} value={sexo}>
                        <View style={styles.radioRow}>
                            <RadioButton.Item label="Masculino" value="M" color={colors.darkOliveGreen}
                                style={[styles.radioItem, sexo === 'M' && styles.radioItemActive]} />
                            <RadioButton.Item label="Femenino" value="F" color={colors.darkOliveGreen}
                                style={[styles.radioItem, sexo === 'F' && styles.radioItemActive]} />
                        </View>
                    </RadioButton.Group>

                    <TextInput
                        label="Contacto (Teléfono/Email)"
                        value={contacto}
                        onChangeText={setContacto}
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor={colors.darkOliveGreen}
                        left={<TextInput.Icon icon="phone" />}
                    />

                    <TextInput
                        label="Dirección"
                        value={direccion}
                        onChangeText={setDireccion}
                        mode="outlined"
                        multiline
                        numberOfLines={2}
                        style={styles.input}
                        activeOutlineColor={colors.darkOliveGreen}
                        left={<TextInput.Icon icon="map-marker" />}
                    />

                    <View style={styles.actions}>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.goBack()}
                            style={styles.cancelBtn}
                            textColor={colors.darkGray}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleGuardar}
                            loading={loading}
                            disabled={loading}
                            buttonColor={colors.darkOliveGreen}
                            icon="content-save"
                            style={styles.saveBtn}
                        >
                            Guardar Paciente
                        </Button>
                    </View>
                </Surface>
            </View>
        </ScrollView>
    );
};

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
    card: {
        borderRadius: 16,
        backgroundColor: colors.white,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginLeft: 12,
    },
    input: {
        marginBottom: 16,
        backgroundColor: colors.white,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.kombuGreen,
        marginBottom: 4,
    },
    radioRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    radioItem: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray,
        marginRight: 8,
    },
    radioItemActive: {
        borderColor: colors.darkOliveGreen,
        backgroundColor: colors.darkOliveGreen + '08',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    cancelBtn: {
        marginRight: 12,
    },
    saveBtn: {
        borderRadius: 10,
    },
});

export default NuevoPacienteScreen;
