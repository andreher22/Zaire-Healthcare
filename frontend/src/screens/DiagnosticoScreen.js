import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Chip, Button, ActivityIndicator, Searchbar, Surface, ProgressBar } from 'react-native-paper';
import { colors } from '../constants/colors';
import DiagnosticoIAService from '../services/DiagnosticoIAService';

const DiagnosticoScreen = ({ navigation }) => {
    const [sintomasDisponibles, setSintomasDisponibles] = useState([]);
    const [sintomasSeleccionados, setSintomasSeleccionados] = useState([]);
    const [loadingSintomas, setLoadingSintomas] = useState(true);
    const [loadingPrediccion, setLoadingPrediccion] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        cargarSintomas();
    }, []);

    const cargarSintomas = async () => {
        try {
            const data = await DiagnosticoIAService.getSintomas();
            // data es { sintomas: ["..."] }
            setSintomasDisponibles(data.sintomas || []);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los síntomas');
        } finally {
            setLoadingSintomas(false);
        }
    };

    const toggleSintoma = (sintoma) => {
        if (sintomasSeleccionados.includes(sintoma)) {
            setSintomasSeleccionados(sintomasSeleccionados.filter(s => s !== sintoma));
        } else {
            setSintomasSeleccionados([...sintomasSeleccionados, sintoma]);
        }
    };

    const analizar = async () => {
        if (sintomasSeleccionados.length < 3) {
            Alert.alert('Advertencia', 'Selecciona al menos 3 síntomas para un mejor análisis.');
            return;
        }

        setLoadingPrediccion(true);
        setResultado(null);
        try {
            const data = await DiagnosticoIAService.predecir({ sintomas: sintomasSeleccionados });
            setResultado(data);
        } catch (error) {
            Alert.alert('Error', 'Falló el análisis de IA');
            console.error(error);
        } finally {
            setLoadingPrediccion(false);
        }
    };

    const reiniciar = () => {
        setSintomasSeleccionados([]);
        setResultado(null);
        setSearchQuery('');
    };

    const renderSintomas = () => {
        const filtered = sintomasDisponibles.filter(s =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <View style={styles.chipContainer}>
                {filtered.slice(0, 50).map((sintoma, index) => ( // Limitar renderizado por rendimiento
                    <Chip
                        key={index}
                        selected={sintomasSeleccionados.includes(sintoma)}
                        onPress={() => toggleSintoma(sintoma)}
                        style={styles.chip}
                        selectedColor={colors.white}
                        showSelectedOverlay
                    >
                        {sintoma.replace(/_/g, ' ')}
                    </Chip>
                ))}
            </View>
        );
    };

    const renderResultado = () => {
        if (!resultado) return null;

        return (
            <Surface style={styles.resultCard} elevation={4}>
                <Text variant="headlineSmall" style={styles.resultTitle}>Resultado del Análisis</Text>

                <View style={styles.predictionRow}>
                    <Text variant="titleLarge" style={styles.diseaseName}>
                        {resultado.prediccion_principal}
                    </Text>
                    <Text variant="titleLarge" style={styles.confidence}>
                        {(resultado.confianza * 100).toFixed(1)}%
                    </Text>
                </View>

                <ProgressBar progress={resultado.confianza} color={resultado.confianza > 0.7 ? colors.success : colors.fawn} style={{ height: 10, borderRadius: 5, marginVertical: 10 }} />

                <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 5 }}>Otras posibilidades:</Text>
                {Object.entries(resultado.top_3).map(([enfermedad, prob]) => (
                    <View key={enfermedad} style={styles.otherPrediction}>
                        <Text>{enfermedad}</Text>
                        <Text>{(prob * 100).toFixed(1)}%</Text>
                    </View>
                ))}

                <Button mode="contained" onPress={reiniciar} style={styles.restartButton}>
                    Nueva Consulta
                </Button>
            </Surface>
        );
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Diagnóstico Asistido por IA</Text>

            {resultado ? (
                renderResultado()
            ) : (
                <>
                    <Text variant="bodyMedium" style={styles.instruction}>
                        Busca y selecciona los síntomas del paciente ({sintomasSeleccionados.length} seleccionados)
                    </Text>

                    <Searchbar
                        placeholder="Buscar síntoma (ej. fiebre, dolor)"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchbar}
                        iconColor={colors.darkOliveGreen}
                    />

                    {loadingSintomas ? (
                        <ActivityIndicator style={{ marginTop: 50 }} color={colors.darkOliveGreen} />
                    ) : (
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            {renderSintomas()}
                        </ScrollView>
                    )}

                    <Button
                        mode="contained"
                        onPress={analizar}
                        loading={loadingPrediccion}
                        disabled={loadingPrediccion || sintomasSeleccionados.length === 0}
                        style={styles.analyzeButton}
                        buttonColor={colors.darkOliveGreen}
                        icon="brain"
                    >
                        Analizar Síntomas
                    </Button>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
        padding: 20,
    },
    title: {
        color: colors.kombuGreen,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    instruction: {
        color: colors.darkGray,
        marginBottom: 15,
    },
    searchbar: {
        marginBottom: 15,
        backgroundColor: colors.white,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    chip: {
        margin: 4,
        backgroundColor: colors.white,
    },
    analyzeButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        paddingVertical: 5,
    },
    resultCard: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
    },
    resultTitle: {
        color: colors.darkOliveGreen,
        textAlign: 'center',
        marginBottom: 20,
    },
    predictionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    diseaseName: {
        fontWeight: 'bold',
        color: colors.kombuGreen,
        flex: 1,
    },
    confidence: {
        color: colors.darkOliveGreen,
        fontWeight: 'bold',
    },
    otherPrediction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    restartButton: {
        marginTop: 30,
        backgroundColor: colors.fawn,
    },
});

export default DiagnosticoScreen;
