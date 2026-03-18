/**
 * ZAIRE Healthcare — NuevoPacienteScreen (Registro de Paciente)
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity, Animated } from 'react-native';
import { TextInput, Button, RadioButton, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useToast } from '../components/ToastContext';
import PacientesService from '../services/PacientesService';

const NuevoPacienteScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const { showToast } = useToast();
    const isDesktop = width > 768;

    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [sexo, setSexo] = useState('M');
    const [contacto, setContacto] = useState('');
    const [direccion, setDireccion] = useState('');
    const [loading, setLoading] = useState(false);

    // ── Entrada: fade + slide desde abajo ──
    const fadeAnim  = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim,  { toValue: 1, duration: 350, useNativeDriver: false }),
            Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 80, useNativeDriver: false }),
        ]).start();
    }, []);

    // ── Scale en botón Guardar ──
    const btnScale = useRef(new Animated.Value(1)).current;
    const pressBtnIn  = () => Animated.spring(btnScale, { toValue: 0.95, useNativeDriver: false }).start();
    const pressBtnOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: false }).start();

    // ── Shake en validación fallida ──
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const triggerShake = () => {
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: false }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: false }),
            Animated.timing(shakeAnim, { toValue: 6,  duration: 50, useNativeDriver: false }),
            Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: false }),
            Animated.timing(shakeAnim, { toValue: 0,  duration: 40, useNativeDriver: false }),
        ]).start();
    };

    const handleGuardar = async () => {
        if (!nombre.trim()) { triggerShake(); showToast('El nombre es obligatorio.', 'error'); return; }
        if (nombre.trim().length < 3) { triggerShake(); showToast('El nombre debe tener al menos 3 caracteres.', 'error'); return; }
        if (!fechaNacimiento) { triggerShake(); showToast('La fecha de nacimiento es obligatoria.', 'error'); return; }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fechaNacimiento)) { triggerShake(); showToast('Formato inválido. Use AAAA-MM-DD', 'error'); return; }
        const date = new Date(fechaNacimiento);
        if (isNaN(date.getTime())) { triggerShake(); showToast('La fecha ingresada no es válida.', 'error'); return; }
        if (date > new Date()) { triggerShake(); showToast('La fecha no puede ser futura.', 'error'); return; }

        setLoading(true);
        try {
            await PacientesService.createPaciente({
                nombre: nombre.trim(),
                fecha_nacimiento: fechaNacimiento,
                sexo,
                contacto: contacto.trim(),
                direccion: direccion.trim(),
            });
            // Fade out al guardar exitoso
            showToast('Paciente registrado correctamente.', 'success');
            Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: false }).start(() => {
                navigation.goBack();
            });
        } catch (error) {
            triggerShake();
            const msg = error.response?.data?.nombre?.[0] || 'No se pudo registrar el paciente.';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView style={{ flex: 1 }}>
            <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                <Animated.View style={{ transform: [{ translateY: slideAnim }, { translateX: shakeAnim }] }}>
                <Surface style={styles.card} elevation={2}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.kombuGreen} />
                        </TouchableOpacity>
                        <MaterialCommunityIcons name="account-plus" size={28} color={colors.darkOliveGreen} />
                        <Text style={styles.title}>Registrar Nuevo Paciente</Text>
                    </View>

                    <TextInput label="Nombre Completo *" value={nombre} onChangeText={setNombre}
                        mode="outlined" style={styles.input} activeOutlineColor={colors.darkOliveGreen}
                        left={<TextInput.Icon icon="account" />} />

                    <TextInput label="Fecha de Nacimiento (AAAA-MM-DD) *" value={fechaNacimiento}
                        onChangeText={setFechaNacimiento} mode="outlined" placeholder="Ej: 1990-05-15"
                        style={styles.input} activeOutlineColor={colors.darkOliveGreen}
                        keyboardType="numeric" left={<TextInput.Icon icon="calendar" />} />

                    <Text style={styles.label}>Sexo</Text>
                    <RadioButton.Group onValueChange={setSexo} value={sexo}>
                        <View style={styles.radioRow}>
                            <RadioButton.Item label="Masculino" value="M" color={colors.darkOliveGreen}
                                style={[styles.radioItem, sexo === 'M' && styles.radioItemActive]} />
                            <RadioButton.Item label="Femenino" value="F" color={colors.darkOliveGreen}
                                style={[styles.radioItem, sexo === 'F' && styles.radioItemActive]} />
                        </View>
                    </RadioButton.Group>

                    <TextInput label="Contacto (Teléfono/Email)" value={contacto} onChangeText={setContacto}
                        mode="outlined" style={styles.input} activeOutlineColor={colors.darkOliveGreen}
                        left={<TextInput.Icon icon="phone" />} />

                    <TextInput label="Dirección" value={direccion} onChangeText={setDireccion}
                        mode="outlined" multiline numberOfLines={2} style={styles.input}
                        activeOutlineColor={colors.darkOliveGreen} left={<TextInput.Icon icon="map-marker" />} />

                    <View style={styles.actions}>
                        <Button mode="outlined" onPress={() => navigation.goBack()}
                            style={styles.cancelBtn} textColor={colors.darkGray}>
                            Cancelar
                        </Button>
                        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                            <Button mode="contained" onPress={handleGuardar}
                                onPressIn={pressBtnIn} onPressOut={pressBtnOut}
                                loading={loading} disabled={loading}
                                buttonColor={colors.darkOliveGreen} icon="content-save"
                                style={styles.saveBtn}>
                                Guardar Paciente
                            </Button>
                        </Animated.View>
                    </View>
                </Surface>
                </Animated.View>
            </View>
        </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.cornsilk },
    content: { padding: 16, paddingBottom: 40 },
    contentDesktop: { maxWidth: 600, alignSelf: 'center', width: '100%' },
    card: { borderRadius: 16, backgroundColor: colors.white, padding: 24 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    backBtn: { marginRight: 10, padding: 4 },
    title: { fontSize: 20, fontWeight: '700', color: colors.kombuGreen, marginLeft: 12 },
    input: { marginBottom: 16, backgroundColor: colors.white },
    label: { fontSize: 14, fontWeight: '600', color: colors.kombuGreen, marginBottom: 4 },
    radioRow: { flexDirection: 'row', marginBottom: 16 },
    radioItem: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: colors.gray, marginRight: 8 },
    radioItemActive: { borderColor: colors.darkOliveGreen, backgroundColor: colors.darkOliveGreen + '08' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8 },
    cancelBtn: { marginRight: 12 },
    saveBtn: { borderRadius: 10 },
});

export default NuevoPacienteScreen;