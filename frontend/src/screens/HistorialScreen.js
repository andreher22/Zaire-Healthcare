import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Modal } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, FAB, Portal, TextInput } from 'react-native-paper';
import { colors } from '../constants/colors';
import HistorialService from '../services/HistorialService';

const HistorialScreen = ({ route, navigation }) => {
    // Si no se pasa pacienteId, mostrar selector (TO-DO) o mensaje
    const pacienteId = route.params?.pacienteId;

    const [historial, setHistorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoEvento, setNuevoEvento] = useState({ sintomas: '', diagnostico: '', tratamiento: '' });

    useEffect(() => {
        if (pacienteId) {
            loadHistorial();
        } else {
            setLoading(false);
        }
    }, [pacienteId]);

    const loadHistorial = async () => {
        try {
            const data = await HistorialService.getHistorial(pacienteId);
            setHistorial(data);
        } catch (error) {
            // Si es 404, es que no tiene historial creado aún (se crea al primer evento o manual)
            if (error.response?.status !== 404) {
                Alert.alert('Error', 'No se pudo cargar el historial');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDescargarPDF = async () => {
        await HistorialService.downloadPDF(pacienteId, `Paciente_${pacienteId}`);
    };

    const handleGuardarEvento = async () => {
        if (!nuevoEvento.diagnostico_medico) {
            Alert.alert('Error', 'El diagnóstico es obligatorio');
            return;
        }

        try {
            await HistorialService.createEvento(pacienteId, nuevoEvento);
            setModalVisible(false);
            setNuevoEvento({ sintomas: '', diagnostico_medico: '', tratamiento: '' });
            loadHistorial(); // Recargar historial
            Alert.alert('Éxito', 'Evento registrado correctamente');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo registrar el evento');
        }
    };

    if (!pacienteId) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="bodyLarge">Selecciona un paciente desde la lista para ver su historial.</Text>
                <Button mode="contained" onPress={() => navigation.navigate('Pacientes')} style={{ marginTop: 20 }}>
                    Ir a Pacientes
                </Button>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.darkOliveGreen} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>Historial Clínico</Text>
                {historial && (
                    <Button
                        mode="outlined"
                        icon="file-pdf-box"
                        onPress={handleDescargarPDF}
                        textColor={colors.liver}
                        style={{ borderColor: colors.liver }}
                    >
                        PDF
                    </Button>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {!historial || !historial.eventos || historial.eventos.length === 0 ? (
                    <Text style={styles.emptyText}>No hay registros en el historial.</Text>
                ) : (
                    historial.eventos.map((evento) => (
                        <Card key={evento.id} style={styles.card} mode="elevated">
                            <Card.Content>
                                <Title style={styles.eventDate}>📅 {new Date(evento.fecha).toLocaleDateString()}</Title>
                                <Paragraph><Text style={{ fontWeight: 'bold' }}>Diagnóstico:</Text> {evento.diagnostico_medico}</Paragraph>
                                {evento.sintomas && <Paragraph><Text style={{ fontWeight: 'bold' }}>Síntomas:</Text> {evento.sintomas}</Paragraph>}
                                {evento.tratamiento && (
                                    <Paragraph style={{ marginTop: 5, color: colors.darkOliveGreen }}>
                                        <Text style={{ fontWeight: 'bold' }}>Tratamiento:</Text> {evento.tratamiento}
                                    </Paragraph>
                                )}
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>

            <FAB
                style={styles.fab}
                icon="plus"
                label="Evento"
                onPress={() => setModalVisible(true)}
                color={colors.white}
            />

            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text variant="titleLarge" style={{ marginBottom: 15, fontWeight: 'bold' }}>Nuevo Evento Clínico</Text>

                        <TextInput
                            label="Diagnóstico Médico *"
                            value={nuevoEvento.diagnostico_medico}
                            onChangeText={(text) => setNuevoEvento({ ...nuevoEvento, diagnostico_medico: text })}
                            mode="outlined"
                            style={styles.input}
                        />

                        <TextInput
                            label="Síntomas"
                            value={nuevoEvento.sintomas}
                            onChangeText={(text) => setNuevoEvento({ ...nuevoEvento, sintomas: text })}
                            mode="outlined"
                            multiline
                            numberOfLines={2}
                            style={styles.input}
                        />

                        <TextInput
                            label="Tratamiento / Receta"
                            value={nuevoEvento.tratamiento}
                            onChangeText={(text) => setNuevoEvento({ ...nuevoEvento, tratamiento: text })}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />

                        <Button mode="contained" onPress={handleGuardarEvento} buttonColor={colors.darkOliveGreen} style={{ marginTop: 10 }}>
                            Guardar
                        </Button>
                        <Button mode="text" onPress={() => setModalVisible(false)} textColor={colors.error} style={{ marginTop: 5 }}>
                            Cancelar
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        color: colors.kombuGreen,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 15,
        backgroundColor: colors.white,
        borderLeftWidth: 4,
        borderLeftColor: colors.darkOliveGreen,
    },
    eventDate: {
        fontSize: 16,
        marginBottom: 5,
        color: colors.darkGray,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: colors.darkGray,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colors.darkOliveGreen,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        width: '90%'
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
});

export default HistorialScreen;
