import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, HelperText, RadioButton, Text } from 'react-native-paper';
import { colors } from '../constants/colors';
import PacientesService from '../services/PacientesService';

const NuevoPacienteScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [sexo, setSexo] = useState('M');
    const [contacto, setContacto] = useState('');
    const [direccion, setDireccion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGuardar = async () => {
        if (!nombre || !fechaNacimiento) {
            Alert.alert('Error', 'Nombre y fecha de nacimiento son obligatorios');
            return;
        }

        // Validación básica de fecha YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fechaNacimiento)) {
            Alert.alert('Error', 'Formato de fecha inválido. Use AAAA-MM-DD');
            return;
        }

        setLoading(true);
        try {
            await PacientesService.createPaciente({
                nombre,
                fecha_nacimiento: fechaNacimiento,
                sexo,
                contacto,
                direccion,
            });
            Alert.alert('Éxito', 'Paciente registrado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'No se pudo registrar el paciente');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="headlineSmall" style={styles.title}>Nuevo Paciente</Text>

            <TextInput
                label="Nombre Completo *"
                value={nombre}
                onChangeText={setNombre}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.darkOliveGreen}
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
            />

            <Text variant="bodyLarge" style={styles.label}>Sexo</Text>
            <RadioButton.Group onValueChange={setSexo} value={sexo}>
                <View style={styles.radioRow}>
                    <RadioButton.Item label="Masculino" value="M" color={colors.darkOliveGreen} />
                    <RadioButton.Item label="Femenino" value="F" color={colors.darkOliveGreen} />
                </View>
            </RadioButton.Group>

            <TextInput
                label="Contacto (Teléfono/Email)"
                value={contacto}
                onChangeText={setContacto}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.darkOliveGreen}
            />

            <TextInput
                label="Dirección"
                value={direccion}
                onChangeText={setDireccion}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                activeOutlineColor={colors.darkOliveGreen}
            />

            <Button
                mode="contained"
                onPress={handleGuardar}
                loading={loading}
                disabled={loading}
                style={styles.button}
                buttonColor={colors.darkOliveGreen}
            >
                Guardar Paciente
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: colors.white,
        flexGrow: 1,
    },
    title: {
        marginBottom: 20,
        color: colors.kombuGreen,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
        backgroundColor: colors.white,
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        color: colors.darkGray,
    },
    radioRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
        paddingVertical: 6,
    },
});

export default NuevoPacienteScreen;
