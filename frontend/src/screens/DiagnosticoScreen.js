/**
 * ZAIRE Healthcare — DiagnosticoScreen (v2 – Rediseño intuitivo)
 * Flujo de 3 pasos: Paciente → Síntomas → Resultado
 * Con stepper visual, búsqueda, chips, barras de confianza y animaciones.
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, ScrollView, StyleSheet, Alert,
    useWindowDimensions, TouchableOpacity, TextInput as RNTextInput, Animated
} from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { traducirSintoma, traducirDiagnostico, obtenerAcciones, getColorUrgencia, getLabelUrgencia } from '../constants/traducciones';
import DiagnosticoIAService from '../services/DiagnosticoIAService';
import PacientesService from '../services/PacientesService';
import LoadingSpinner from '../components/LoadingSpinner';

const DiagnosticoScreen = ({ route, navigation }) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const scrollRef = useRef(null);

    // Flow state
    const [step, setStep] = useState(1);

    // Step 1: Patient
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [pacienteSearch, setPacienteSearch] = useState('');

    // Step 2: Symptoms
    const [sintomas, setSintomas] = useState([]);
    const [selectedSintomas, setSelectedSintomas] = useState([]);
    const [sintomaSearch, setSintomaSearch] = useState('');
    const [loadingSintomas, setLoadingSintomas] = useState(false);

    // Step 3: Result
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);

    // If navigated with pacienteId, skip to step 2
    useEffect(() => {
        const pacienteId = route?.params?.pacienteId;
        if (pacienteId) {
            loadPacienteDirecto(pacienteId);
        } else {
            loadPacientes();
        }
    }, []);

    const loadPacientes = async () => {
        try {
            const data = await PacientesService.getPacientes();
            setPacientes(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.log('Error cargando pacientes:', error);
        }
    };

    const loadPacienteDirecto = async (id) => {
        try {
            const data = await PacientesService.getPaciente(id);
            setSelectedPaciente(data);
            setStep(2);
            loadSintomas();
        } catch (error) {
            loadPacientes();
        }
    };

    const loadSintomas = async () => {
        setLoadingSintomas(true);
        try {
            const data = await DiagnosticoIAService.getSintomas();
            setSintomas(data.sintomas || data || []);
        } catch (error) {
            console.log('Error cargando síntomas:', error);
        } finally {
            setLoadingSintomas(false);
        }
    };

    const handleSelectPaciente = (paciente) => {
        setSelectedPaciente(paciente);
        setStep(2);
        loadSintomas();
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    const toggleSintoma = (sintoma) => {
        setSelectedSintomas(prev =>
            prev.includes(sintoma) ? prev.filter(s => s !== sintoma) : [...prev, sintoma]
        );
    };

    const handleDiagnosticar = async () => {
        if (selectedSintomas.length < 2) {
            Alert.alert('Atención', 'Seleccione al menos 2 síntomas para un diagnóstico más preciso.');
            return;
        }
        setLoading(true);
        try {
            const data = await DiagnosticoIAService.predecir({
                paciente_id: selectedPaciente.id,
                sintomas: selectedSintomas,
            });
            // Backend retorna { mensaje, resultado: { diagnostico_predicho, confianza, ... } }
            const res = data.resultado || data;
            setResultado(res);
            setStep(3);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        } catch (error) {
            Alert.alert('Error', 'No se pudo procesar el diagnóstico. Intente nuevamente.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNuevo = () => {
        setStep(1);
        setSelectedPaciente(null);
        setSelectedSintomas([]);
        setResultado(null);
        setSintomaSearch('');
        setPacienteSearch('');
    };

    const formatSintoma = (s) => traducirSintoma(s);

    const pacientesFiltrados = pacientes.filter(p =>
        p.nombre.toLowerCase().includes(pacienteSearch.toLowerCase())
    );

    const sintomasFiltrados = sintomas.filter(s => {
        const searchLower = sintomaSearch.toLowerCase();
        const enName = s.toLowerCase();
        const esName = traducirSintoma(s).toLowerCase();
        return enName.includes(searchLower.replace(/ /g, '_')) || esName.includes(searchLower);
    });

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.content, isDesktop && styles.contentDesktop]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <MaterialCommunityIcons name="brain" size={28} color={colors.darkOliveGreen} />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.headerTitle}>Diagnóstico con IA</Text>
                                <Text style={styles.headerSub}>Asistente inteligente de apoyo clínico</Text>
                            </View>
                        </View>
                        {step > 1 && (
                            <TouchableOpacity style={styles.newBtn} onPress={handleNuevo}>
                                <MaterialCommunityIcons name="refresh" size={18} color={colors.darkOliveGreen} />
                                <Text style={styles.newBtnText}>Nueva</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Stepper */}
                    <View style={styles.stepper}>
                        {[
                            { num: 1, label: 'Paciente', icon: 'account' },
                            { num: 2, label: 'Síntomas', icon: 'format-list-checks' },
                            { num: 3, label: 'Resultado', icon: 'chart-bar' },
                        ].map((s, idx) => (
                            <React.Fragment key={s.num}>
                                <TouchableOpacity
                                    style={[styles.stepItem, step >= s.num && styles.stepItemActive, step === s.num && styles.stepItemCurrent]}
                                    onPress={() => { if (s.num < step) setStep(s.num); }}
                                    disabled={s.num > step}
                                >
                                    <View style={[styles.stepCircle, step >= s.num && styles.stepCircleActive]}>
                                        {step > s.num ? (
                                            <MaterialCommunityIcons name="check" size={16} color={colors.white} />
                                        ) : (
                                            <MaterialCommunityIcons name={s.icon} size={16} color={step >= s.num ? colors.white : colors.darkGray} />
                                        )}
                                    </View>
                                    <Text style={[styles.stepLabel, step >= s.num && styles.stepLabelActive]}>{s.label}</Text>
                                </TouchableOpacity>
                                {idx < 2 && <View style={[styles.stepLine, step > s.num && styles.stepLineActive]} />}
                            </React.Fragment>
                        ))}
                    </View>

                    {/* ========== STEP 1: SELECT PATIENT ========== */}
                    {step === 1 && (
                        <View style={styles.stepContent}>
                            <View style={styles.stepHeader}>
                                <Text style={styles.stepTitle}>¿Para quién es el diagnóstico?</Text>
                                <Text style={styles.stepDesc}>Seleccione el paciente a evaluar</Text>
                            </View>

                            <View style={styles.searchBox}>
                                <MaterialCommunityIcons name="magnify" size={20} color={colors.darkOliveGreen} />
                                <RNTextInput
                                    placeholder="Buscar paciente por nombre..."
                                    value={pacienteSearch}
                                    onChangeText={setPacienteSearch}
                                    style={styles.searchInput}
                                    placeholderTextColor={colors.darkGray}
                                />
                                {pacienteSearch.length > 0 && (
                                    <TouchableOpacity onPress={() => setPacienteSearch('')}>
                                        <MaterialCommunityIcons name="close-circle" size={18} color={colors.darkGray} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={isDesktop ? styles.patientsGrid : undefined}>
                                {pacientesFiltrados.length === 0 ? (
                                    <Text style={styles.emptyText}>No se encontraron pacientes</Text>
                                ) : (
                                    pacientesFiltrados.map(p => (
                                        <TouchableOpacity
                                            key={p.id}
                                            style={[styles.patientCard, isDesktop && styles.patientCardDesktop]}
                                            onPress={() => handleSelectPaciente(p)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.patientAvatar, { backgroundColor: p.sexo === 'F' ? colors.fawn + '20' : colors.darkOliveGreen + '15' }]}>
                                                <MaterialCommunityIcons
                                                    name={p.sexo === 'F' ? 'face-woman' : 'face-man'}
                                                    size={22}
                                                    color={p.sexo === 'F' ? colors.fawn : colors.darkOliveGreen}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.patientName}>{p.nombre}</Text>
                                                <Text style={styles.patientSub}>
                                                    {p.edad} años • {p.sexo === 'M' ? 'Masculino' : 'Femenino'}
                                                </Text>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.fawn} />
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        </View>
                    )}

                    {/* ========== STEP 2: SELECT SYMPTOMS ========== */}
                    {step === 2 && (
                        <View style={styles.stepContent}>
                            {/* Selected patient badge */}
                            <View style={styles.patientBadge}>
                                <MaterialCommunityIcons name="account-check" size={20} color={colors.darkOliveGreen} />
                                <Text style={styles.patientBadgeText}>{selectedPaciente?.nombre}</Text>
                                <TouchableOpacity onPress={() => setStep(1)}>
                                    <Text style={styles.changeLink}>Cambiar</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.stepHeader}>
                                <Text style={styles.stepTitle}>¿Qué síntomas presenta?</Text>
                                <Text style={styles.stepDesc}>
                                    Seleccione los síntomas observados ({selectedSintomas.length} seleccionados)
                                </Text>
                            </View>

                            {/* Selected symptoms chips */}
                            {selectedSintomas.length > 0 && (
                                <View style={styles.selectedChips}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {selectedSintomas.map(s => (
                                            <TouchableOpacity key={s} style={styles.selectedChip} onPress={() => toggleSintoma(s)}>
                                                <Text style={styles.selectedChipText}>{formatSintoma(s)}</Text>
                                                <MaterialCommunityIcons name="close" size={14} color={colors.white} style={{ marginLeft: 4 }} />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {/* Symptom search */}
                            <View style={styles.searchBox}>
                                <MaterialCommunityIcons name="magnify" size={20} color={colors.darkOliveGreen} />
                                <RNTextInput
                                    placeholder="Buscar síntoma (ej: dolor de cabeza, fatiga...)"
                                    value={sintomaSearch}
                                    onChangeText={setSintomaSearch}
                                    style={styles.searchInput}
                                    placeholderTextColor={colors.darkGray}
                                />
                                {sintomaSearch.length > 0 && (
                                    <TouchableOpacity onPress={() => setSintomaSearch('')}>
                                        <MaterialCommunityIcons name="close-circle" size={18} color={colors.darkGray} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Symptoms list */}
                            {loadingSintomas ? (
                                <LoadingSpinner message="Cargando síntomas..." size="small" />
                            ) : (
                                <View style={isDesktop ? styles.symptomsGrid : undefined}>
                                    {sintomasFiltrados.slice(0, isDesktop ? 60 : 40).map(s => {
                                        const isSelected = selectedSintomas.includes(s);
                                        return (
                                            <TouchableOpacity
                                                key={s}
                                                style={[styles.symptomItem, isSelected && styles.symptomItemSelected, isDesktop && styles.symptomItemDesktop]}
                                                onPress={() => toggleSintoma(s)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={isSelected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                                    size={20}
                                                    color={isSelected ? colors.darkOliveGreen : colors.darkGray + '80'}
                                                />
                                                <Text style={[styles.symptomText, isSelected && styles.symptomTextSelected]}>
                                                    {formatSintoma(s)}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {/* Diagnose button */}
                            <TouchableOpacity
                                style={[styles.diagnoseBtn, (loading || selectedSintomas.length < 2) && styles.diagnoseBtnDisabled]}
                                onPress={handleDiagnosticar}
                                disabled={loading || selectedSintomas.length < 2}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="brain" size={22} color={colors.white} />
                                <Text style={styles.diagnoseBtnText}>
                                    {loading ? 'Analizando...' : `Diagnosticar (${selectedSintomas.length} síntomas)`}
                                </Text>
                            </TouchableOpacity>
                            {selectedSintomas.length < 2 && selectedSintomas.length > 0 && (
                                <Text style={styles.hintText}>Seleccione al menos 2 síntomas</Text>
                            )}
                        </View>
                    )}

                    {/* ========== STEP 3: RESULT ========== */}
                    {step === 3 && resultado && (
                        <ResultView
                            resultado={resultado}
                            paciente={selectedPaciente}
                            selectedSintomas={selectedSintomas}
                            formatSintoma={formatSintoma}
                            onNuevo={handleNuevo}
                            isDesktop={isDesktop}
                        />
                    )}

                    {/* Loading overlay */}
                    {loading && step === 2 && (
                        <View style={styles.loadingOverlay}>
                            <View style={styles.loadingBox}>
                                <MaterialCommunityIcons name="brain" size={40} color={colors.darkOliveGreen} />
                                <Text style={styles.loadingTitle}>Analizando síntomas...</Text>
                                <Text style={styles.loadingDesc}>El modelo de IA está procesando los {selectedSintomas.length} síntomas</Text>
                                <View style={styles.progressTrack}>
                                    <View style={styles.progressFill} />
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

// ========== RESULT VIEW COMPONENT ==========
const ResultView = ({ resultado, paciente, selectedSintomas, formatSintoma, onNuevo, isDesktop }) => {
    const diagEN = resultado.diagnostico_predicho || resultado.diagnostico || 'Indeterminado';
    const diag = traducirDiagnostico(diagEN);
    const conf = resultado.confianza || 0;
    const tops = resultado.top_predicciones || [];
    const acciones = obtenerAcciones(diagEN);

    const getConfColor = (val) => {
        if (val >= 75) return colors.success;
        if (val >= 50) return colors.fawn;
        return colors.error;
    };

    const getConfLabel = (val) => {
        if (val >= 85) return 'Muy alta';
        if (val >= 70) return 'Alta';
        if (val >= 50) return 'Moderada';
        return 'Baja';
    };

    const getConfEmoji = (val) => {
        if (val >= 75) return '🟢';
        if (val >= 50) return '🟡';
        return '🔴';
    };

    return (
        <View style={styles.stepContent}>
            {/* Patient badge */}
            <View style={styles.patientBadge}>
                <MaterialCommunityIcons name="account-check" size={20} color={colors.darkOliveGreen} />
                <Text style={styles.patientBadgeText}>{paciente?.nombre}</Text>
            </View>

            {/* Main result card */}
            <View style={styles.resultCard}>
                <View style={styles.resultIcon}>
                    <MaterialCommunityIcons name="check-decagram" size={36} color={colors.success} />
                </View>
                <Text style={styles.resultLabel}>Diagnóstico Principal</Text>
                <Text style={styles.resultDiag}>{diag}</Text>

                {/* Confidence meter */}
                <View style={styles.confMeter}>
                    <View style={styles.confRow}>
                        <Text style={styles.confLabel}>Confianza</Text>
                        <Text style={[styles.confValue, { color: getConfColor(conf) }]}>
                            {getConfEmoji(conf)} {conf.toFixed(1)}% — {getConfLabel(conf)}
                        </Text>
                    </View>
                    <View style={styles.confTrack}>
                        <View style={[styles.confFill, { width: `${conf}%`, backgroundColor: getConfColor(conf) }]} />
                    </View>
                </View>

                {/* Disclaimer */}
                <View style={styles.disclaimer}>
                    <MaterialCommunityIcons name="information-outline" size={16} color={colors.liver} />
                    <Text style={styles.disclaimerText}>
                        Este resultado es un apoyo diagnóstico. El diagnóstico final es responsabilidad del médico.
                    </Text>
                </View>
            </View>

            {/* Other predictions */}
            {/* Urgencia y especialista */}
            <View style={styles.urgenciaCard}>
                <View style={styles.urgenciaRow}>
                    <Text style={[styles.urgenciaTag, { backgroundColor: getColorUrgencia(acciones.urgencia) + '18', color: getColorUrgencia(acciones.urgencia) }]}>
                        {getLabelUrgencia(acciones.urgencia)}
                    </Text>
                </View>
                <View style={styles.especialistaRow}>
                    <MaterialCommunityIcons name="doctor" size={18} color={colors.darkOliveGreen} />
                    <Text style={styles.especialistaText}>Especialista: <Text style={{ fontWeight: '700' }}>{acciones.especialista}</Text></Text>
                </View>
            </View>

            {/* Acciones sugeridas */}
            <View style={styles.accionesSection}>
                <Text style={styles.sectionTitle}>📋 Acciones Sugeridas</Text>
                {acciones.acciones.map((accion, idx) => (
                    <View key={idx} style={styles.accionItem}>
                        <View style={styles.accionNum}>
                            <Text style={styles.accionNumText}>{idx + 1}</Text>
                        </View>
                        <Text style={styles.accionText}>{accion}</Text>
                    </View>
                ))}
            </View>

            {tops.length > 1 && (
                <View style={styles.altSection}>
                    <Text style={styles.sectionTitle}>Otras Posibilidades</Text>
                    {tops.slice(1).map((t, idx) => (
                        <View key={idx} style={styles.altItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.altName}>{traducirDiagnostico(t.diagnostico)}</Text>
                                <View style={styles.altBar}>
                                    <View style={[styles.altBarFill, { width: `${t.confianza || 0}%`, backgroundColor: getConfColor(t.confianza || 0) }]} />
                                </View>
                            </View>
                            <Text style={[styles.altConf, { color: getConfColor(t.confianza || 0) }]}>
                                {(t.confianza || 0).toFixed(1)}%
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Symptoms analyzed */}
            <View style={styles.analyzedSection}>
                <Text style={styles.sectionTitle}>Síntomas Analizados ({selectedSintomas.length})</Text>
                <View style={styles.analyzedChips}>
                    {selectedSintomas.map(s => (
                        <View key={s} style={styles.analyzedChip}>
                            <MaterialCommunityIcons name="check-circle-outline" size={14} color={colors.darkOliveGreen} />
                            <Text style={styles.analyzedChipText}>{formatSintoma(s)}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Actions */}
            <View style={styles.resultActions}>
                <TouchableOpacity style={styles.newConsultBtn} onPress={onNuevo} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="refresh" size={20} color={colors.white} />
                    <Text style={styles.newConsultBtnText}>Nueva Consulta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ========== STYLES ==========
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    contentDesktop: {
        maxWidth: 900,
        alignSelf: 'center',
        width: '100%',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.kombuGreen,
    },
    headerSub: {
        fontSize: 13,
        color: colors.darkGray,
        marginTop: 1,
    },
    newBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkOliveGreen + '12',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    newBtnText: {
        color: colors.darkOliveGreen,
        fontWeight: '600',
        fontSize: 13,
        marginLeft: 4,
    },

    // Stepper
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    stepItem: {
        alignItems: 'center',
        opacity: 0.4,
    },
    stepItemActive: {
        opacity: 1,
    },
    stepItemCurrent: {
        opacity: 1,
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    stepCircleActive: {
        backgroundColor: colors.darkOliveGreen,
    },
    stepLabel: {
        fontSize: 11,
        color: colors.darkGray,
        fontWeight: '500',
    },
    stepLabelActive: {
        color: colors.darkOliveGreen,
        fontWeight: '700',
    },
    stepLine: {
        width: 60,
        height: 2,
        backgroundColor: colors.gray,
        marginHorizontal: 10,
        marginBottom: 18,
    },
    stepLineActive: {
        backgroundColor: colors.darkOliveGreen,
    },

    // Step content
    stepContent: {},
    stepHeader: {
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.kombuGreen,
    },
    stepDesc: {
        fontSize: 14,
        color: colors.darkGray,
        marginTop: 4,
    },

    // Search box
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.kombuGreen,
        marginLeft: 10,
        outlineStyle: 'none',
    },

    // Patient cards
    patientsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    patientCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 14,
        borderRadius: 14,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
    },
    patientCardDesktop: {
        width: '48%',
        marginRight: '2%',
    },
    patientAvatar: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    patientName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.kombuGreen,
    },
    patientSub: {
        fontSize: 12,
        color: colors.darkGray,
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.darkGray,
        padding: 30,
        fontSize: 14,
    },

    // Patient badge
    patientBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkOliveGreen + '10',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 16,
    },
    patientBadgeText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: colors.darkOliveGreen,
        marginLeft: 8,
    },
    changeLink: {
        fontSize: 13,
        color: colors.liver,
        fontWeight: '600',
    },

    // Selected symptoms chips
    selectedChips: {
        marginBottom: 12,
    },
    selectedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkOliveGreen,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
    },
    selectedChipText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },

    // Symptoms grid
    symptomsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    symptomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 4,
    },
    symptomItemSelected: {
        backgroundColor: colors.darkOliveGreen + '08',
    },
    symptomItemDesktop: {
        width: '48%',
        marginRight: '2%',
    },
    symptomText: {
        marginLeft: 8,
        fontSize: 14,
        color: colors.darkGray,
    },
    symptomTextSelected: {
        color: colors.kombuGreen,
        fontWeight: '600',
    },

    // Diagnose button
    diagnoseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.liver,
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 20,
        elevation: 3,
        shadowColor: colors.liver,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    diagnoseBtnDisabled: {
        backgroundColor: colors.darkGray + '40',
        elevation: 0,
        shadowOpacity: 0,
    },
    diagnoseBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
    hintText: {
        textAlign: 'center',
        color: colors.fawn,
        fontSize: 12,
        marginTop: 8,
    },

    // Loading overlay
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(254,250,224,0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingBox: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: 280,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    loadingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginTop: 14,
    },
    loadingDesc: {
        fontSize: 13,
        color: colors.darkGray,
        marginTop: 6,
        textAlign: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 4,
        backgroundColor: colors.gray,
        borderRadius: 2,
        marginTop: 16,
        overflow: 'hidden',
    },
    progressFill: {
        width: '60%',
        height: '100%',
        backgroundColor: colors.darkOliveGreen,
        borderRadius: 2,
    },

    // Result card
    resultCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    resultIcon: {
        marginBottom: 12,
    },
    resultLabel: {
        fontSize: 13,
        color: colors.darkGray,
        fontWeight: '500',
    },
    resultDiag: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.kombuGreen,
        marginVertical: 8,
        textAlign: 'center',
    },

    // Confidence meter
    confMeter: {
        width: '100%',
        marginTop: 12,
    },
    confRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    confLabel: {
        fontSize: 13,
        color: colors.darkGray,
        fontWeight: '500',
    },
    confValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    confTrack: {
        width: '100%',
        height: 10,
        backgroundColor: colors.gray,
        borderRadius: 5,
        overflow: 'hidden',
    },
    confFill: {
        height: '100%',
        borderRadius: 5,
    },

    // Disclaimer
    disclaimer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.liver + '10',
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        width: '100%',
    },
    disclaimerText: {
        fontSize: 12,
        color: colors.liver,
        marginLeft: 8,
        flex: 1,
        lineHeight: 18,
    },

    // Alt predictions
    altSection: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginBottom: 12,
    },
    altItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    altName: {
        fontSize: 14,
        color: colors.kombuGreen,
        fontWeight: '500',
        marginBottom: 4,
    },
    altBar: {
        height: 6,
        backgroundColor: colors.gray,
        borderRadius: 3,
        overflow: 'hidden',
    },
    altBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    altConf: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 14,
        minWidth: 50,
        textAlign: 'right',
    },

    // Analyzed symptoms
    analyzedSection: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    analyzedChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    analyzedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkOliveGreen + '10',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 6,
    },
    analyzedChipText: {
        fontSize: 12,
        color: colors.darkOliveGreen,
        fontWeight: '500',
        marginLeft: 4,
    },

    // Result actions
    resultActions: {
        alignItems: 'center',
    },
    newConsultBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkOliveGreen,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    newConsultBtnText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },

    // Urgencia y especialista
    urgenciaCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    urgenciaRow: {
        marginBottom: 10,
    },
    urgenciaTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        fontSize: 14,
        fontWeight: '700',
        overflow: 'hidden',
    },
    especialistaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    especialistaText: {
        fontSize: 14,
        color: colors.kombuGreen,
        marginLeft: 8,
    },

    // Acciones sugeridas
    accionesSection: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    accionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    accionNum: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.darkOliveGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 1,
    },
    accionNumText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    accionText: {
        fontSize: 14,
        color: colors.kombuGreen,
        flex: 1,
        lineHeight: 20,
    },
});

export default DiagnosticoScreen;
