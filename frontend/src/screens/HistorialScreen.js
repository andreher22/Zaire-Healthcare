/**
 * ZAIRE Healthcare — HistorialScreen (Mini Dashboard de Historial)
 * Muestra una vista analítica de historiales clínicos con:
 * - Buscador de pacientes para ver historial
 * - Lista de historiales con eventos recientes
 * - Gráficas/resumen de actividad clínica
 * - Descarga de PDF
 *
 * Basado en el boceto: "Con gráficas en caso de cada min necesaria → Reportes"
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, ScrollView, StyleSheet, Alert, Modal as RNModal,
    useWindowDimensions, TouchableOpacity, RefreshControl, TextInput as RNTextInput
} from 'react-native';
import {
    Text, Surface, Button, Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import PacientesService from '../services/PacientesService';
import HistorialService from '../services/HistorialService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const HistorialScreen = ({ route }) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [historial, setHistorial] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Modal para nuevo evento
    const [modalVisible, setModalVisible] = useState(false);
    const [eventoForm, setEventoForm] = useState({
        tipo: 'consulta',
        descripcion: '',
        sintomas: '',
        diagnostico: '',
        tratamiento: '',
    });
    const [savingEvento, setSavingEvento] = useState(false);

    useEffect(() => {
        loadPacientes();
        // Si viene pacienteId desde navegación
        const pacienteId = route?.params?.pacienteId;
        if (pacienteId) {
            loadHistorialDirecto(pacienteId);
        }
    }, []);

    /** Cargar lista de pacientes para el buscador. */
    const loadPacientes = async () => {
        try {
            const data = await PacientesService.getPacientes();
            setPacientes(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.log('Error cargando pacientes:', error);
        }
    };

    /** Cargar historial por ID directo. */
    const loadHistorialDirecto = async (pacienteId) => {
        setLoading(true);
        try {
            const pacs = await PacientesService.getPacientes();
            const lista = Array.isArray(pacs) ? pacs : pacs.results || [];
            const pac = lista.find(p => p.id === pacienteId);
            if (pac) setSelectedPaciente(pac);

            const data = await HistorialService.getHistorial(pacienteId);
            setHistorial(data);
        } catch (error) {
            console.log('No hay historial para este paciente aún');
            setHistorial(null);
        } finally {
            setLoading(false);
        }
    };

    /** Seleccionar paciente y cargar su historial. */
    const handleSelectPaciente = async (paciente) => {
        setSelectedPaciente(paciente);
        setLoading(true);
        try {
            const data = await HistorialService.getHistorial(paciente.id);
            setHistorial(data);
        } catch (error) {
            setHistorial(null);
        } finally {
            setLoading(false);
        }
    };

    /** Refresh historial. */
    const onRefresh = useCallback(async () => {
        if (!selectedPaciente) return;
        setRefreshing(true);
        await handleSelectPaciente(selectedPaciente);
        setRefreshing(false);
    }, [selectedPaciente]);

    /** Guardar nuevo evento clínico. */
    const handleSaveEvento = async () => {
        if (!eventoForm.descripcion.trim()) {
            Alert.alert('Error', 'La descripción es obligatoria.');
            return;
        }
        if (!historial?.id) {
            Alert.alert('Error', 'No hay historial activo para este paciente.');
            return;
        }
        setSavingEvento(true);
        try {
            await HistorialService.createEvento(historial.id, {
                ...eventoForm,
                historial: historial.id,
            });
            setModalVisible(false);
            setEventoForm({ tipo: 'consulta', descripcion: '', sintomas: '', diagnostico: '', tratamiento: '' });
            // Recargar historial
            const data = await HistorialService.getHistorial(selectedPaciente.id);
            setHistorial(data);
            Alert.alert('Éxito', 'Evento clínico registrado correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el evento.');
        } finally {
            setSavingEvento(false);
        }
    };

    /** Descargar PDF del historial. */
    const handleDownloadPDF = () => {
        if (!historial?.id || !selectedPaciente) return;
        HistorialService.downloadPDF(historial.id, selectedPaciente.nombre);
    };

    /** Obtener icono por tipo de evento. */
    const getEventIcon = (tipo) => {
        const icons = {
            consulta: 'stethoscope',
            diagnostico: 'clipboard-text',
            seguimiento: 'calendar-check',
            tratamiento: 'pill',
            emergencia: 'ambulance',
        };
        return icons[tipo] || 'file-document';
    };

    /** Obtener color por tipo de evento. */
    const getEventColor = (tipo) => {
        const colores = {
            consulta: colors.darkOliveGreen,
            diagnostico: colors.liver,
            seguimiento: colors.fawn,
            tratamiento: '#4CAF50',
            emergencia: colors.error,
        };
        return colores[tipo] || colors.darkGray;
    };

    /** Formatear fecha. */
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('es-MX', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Filtrar pacientes
    const filteredPacientes = pacientes.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    );

    // Calcular stats del historial
    const eventos = historial?.eventos || [];
    const totalConsultas = eventos.filter(e => e.tipo === 'consulta').length;
    const totalDiag = eventos.filter(e => e.tipo === 'diagnostico').length;
    const totalEmergencias = eventos.filter(e => e.tipo === 'emergencia').length;

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.darkOliveGreen]} />}
            >
                <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                    {isDesktop ? (
                        // DESKTOP: Sidebar izquierda con pacientes + Panel derecho con historial
                        <View style={styles.desktopGrid}>
                            <View style={styles.sidebar}>
                                <Text style={styles.sidebarTitle}>Pacientes</Text>
                                <View style={styles.search}>
                                    <MaterialCommunityIcons name="magnify" size={18} color={colors.darkOliveGreen} style={{ marginRight: 8 }} />
                                    <RNTextInput
                                        placeholder="Buscar..."
                                        value={search}
                                        onChangeText={setSearch}
                                        style={styles.searchInput}
                                        placeholderTextColor={colors.darkGray}
                                    />
                                </View>
                                <ScrollView style={styles.pacienteList}>
                                    {filteredPacientes.map(p => (
                                        <TouchableOpacity
                                            key={p.id}
                                            style={[styles.pacienteItem, selectedPaciente?.id === p.id && styles.pacienteItemActive]}
                                            onPress={() => handleSelectPaciente(p)}
                                        >
                                            <View style={styles.pacienteAvatar}>
                                                <Text style={styles.pacienteAvatarText}>
                                                    {p.nombre.split(' ').map(w => w[0]).join('').substring(0, 2)}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.pacienteName} numberOfLines={1}>{p.nombre}</Text>
                                                <Text style={styles.pacienteSub}>{p.edad} años</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={styles.mainPanel}>
                                {renderHistorialContent()}
                            </View>
                        </View>
                    ) : (
                        // MOBILE
                        <>
                            {!selectedPaciente ? (
                                renderPacienteSelector()
                            ) : (
                                renderHistorialContent()
                            )}
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Modal para nuevo evento */}
            <RNModal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Nuevo Evento Clínico</Text>

                            <Text style={styles.fieldLabel}>Tipo de Evento</Text>
                            <View style={styles.radioRow}>
                                {['consulta', 'diagnostico', 'seguimiento', 'tratamiento', 'emergencia'].map(tipo => (
                                    <TouchableOpacity
                                        key={tipo}
                                        style={[styles.radioOption, eventoForm.tipo === tipo && styles.radioOptionActive]}
                                        onPress={() => setEventoForm(f => ({ ...f, tipo }))}
                                    >
                                        <View style={[styles.radioCircle, eventoForm.tipo === tipo && styles.radioCircleActive]} />
                                        <Text style={[styles.radioLabel, eventoForm.tipo === tipo && styles.radioLabelActive]}>
                                            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.fieldLabel}>Descripción *</Text>
                            <RNTextInput
                                value={eventoForm.descripcion}
                                onChangeText={v => setEventoForm(f => ({ ...f, descripcion: v }))}
                                style={styles.modalInput}
                                multiline
                                placeholder="Describe el evento clínico..."
                                placeholderTextColor={colors.darkGray}
                            />

                            <Text style={styles.fieldLabel}>Síntomas</Text>
                            <RNTextInput
                                value={eventoForm.sintomas}
                                onChangeText={v => setEventoForm(f => ({ ...f, sintomas: v }))}
                                style={styles.modalInput}
                                multiline
                                placeholder="Síntomas observados..."
                                placeholderTextColor={colors.darkGray}
                            />

                            <Text style={styles.fieldLabel}>Diagnóstico</Text>
                            <RNTextInput
                                value={eventoForm.diagnostico}
                                onChangeText={v => setEventoForm(f => ({ ...f, diagnostico: v }))}
                                style={styles.modalInput}
                                placeholder="Diagnóstico emitido..."
                                placeholderTextColor={colors.darkGray}
                            />

                            <Text style={styles.fieldLabel}>Tratamiento</Text>
                            <RNTextInput
                                value={eventoForm.tratamiento}
                                onChangeText={v => setEventoForm(f => ({ ...f, tratamiento: v }))}
                                style={styles.modalInput}
                                multiline
                                placeholder="Tratamiento indicado..."
                                placeholderTextColor={colors.darkGray}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.btnCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnSave} onPress={handleSaveEvento} disabled={savingEvento}>
                                    <Text style={styles.btnSaveText}>{savingEvento ? 'Guardando...' : 'Guardar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </RNModal>
        </View>
    );

    /** Render selector de paciente (móvil). */
    function renderPacienteSelector() {
        return (
            <View style={styles.selectorSection}>
                <Text style={styles.pageTitle}>Historial Clínico</Text>
                <Text style={styles.pageSubtitle}>Seleccione un paciente para ver su historial</Text>
                <View style={styles.search}>
                    <MaterialCommunityIcons name="magnify" size={18} color={colors.darkOliveGreen} style={{ marginRight: 8 }} />
                    <RNTextInput
                        placeholder="Buscar paciente..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                        placeholderTextColor={colors.darkGray}
                    />
                </View>
                {filteredPacientes.map(p => (
                    <TouchableOpacity key={p.id} style={styles.pacienteCard} onPress={() => handleSelectPaciente(p)}>
                        <View style={styles.pacienteAvatar}>
                            <Text style={styles.pacienteAvatarText}>
                                {p.nombre.split(' ').map(w => w[0]).join('').substring(0, 2)}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.pacienteName}>{p.nombre}</Text>
                            <Text style={styles.pacienteSub}>{p.edad} años • {p.sexo === 'M' ? 'Masculino' : 'Femenino'}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.fawn} />
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    /** Render contenido del historial. */
    function renderHistorialContent() {
        if (loading) return <LoadingSpinner message="Cargando historial..." />;

        if (!selectedPaciente) {
            return <EmptyState icon="clipboard-text-off-outline" title="Seleccione un paciente" message="Elija un paciente del panel izquierdo para ver su historial clínico." />;
        }

        return (
            <View style={styles.historialContent}>
                {/* Header del paciente */}
                <View style={styles.historialHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.historialName}>{selectedPaciente.nombre}</Text>
                        <Text style={styles.historialSub}>
                            {selectedPaciente.edad} años • {selectedPaciente.sexo === 'M' ? 'Masculino' : 'Femenino'}
                            {historial?.alergias ? ` • Alergias: ${historial.alergias}` : ''}
                        </Text>
                    </View>
                    <View style={styles.historialActions}>
                        <TouchableOpacity onPress={handleDownloadPDF} style={styles.actionBtn}>
                            <MaterialCommunityIcons name="file-pdf-box" size={24} color={colors.liver} />
                        </TouchableOpacity>
                        {!isDesktop && (
                            <TouchableOpacity onPress={() => setSelectedPaciente(null)} style={styles.actionBtn}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.darkGray} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Stats del historial */}
                <View style={styles.historialStats}>
                    <Surface style={styles.miniStat} elevation={1}>
                        <Text style={styles.miniStatValue}>{eventos.length}</Text>
                        <Text style={styles.miniStatLabel}>Total</Text>
                    </Surface>
                    <Surface style={styles.miniStat} elevation={1}>
                        <Text style={[styles.miniStatValue, { color: colors.darkOliveGreen }]}>{totalConsultas}</Text>
                        <Text style={styles.miniStatLabel}>Consultas</Text>
                    </Surface>
                    <Surface style={styles.miniStat} elevation={1}>
                        <Text style={[styles.miniStatValue, { color: colors.liver }]}>{totalDiag}</Text>
                        <Text style={styles.miniStatLabel}>Diagnósticos</Text>
                    </Surface>
                    <Surface style={styles.miniStat} elevation={1}>
                        <Text style={[styles.miniStatValue, { color: colors.error }]}>{totalEmergencias}</Text>
                        <Text style={styles.miniStatLabel}>Emergencias</Text>
                    </Surface>
                </View>

                {/* Antecedentes */}
                {historial?.antecedentes && (
                    <Surface style={styles.infoCard} elevation={1}>
                        <View style={styles.infoCardHeader}>
                            <MaterialCommunityIcons name="heart-pulse" size={20} color={colors.liver} />
                            <Text style={styles.infoCardTitle}>Antecedentes</Text>
                        </View>
                        <Text style={styles.infoCardText}>{historial.antecedentes}</Text>
                    </Surface>
                )}

                {/* Timeline de eventos */}
                <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTitle}>Línea de Tiempo</Text>
                    <Button mode="contained-tonal" icon="plus" onPress={() => setModalVisible(true)}
                        buttonColor={colors.darkOliveGreen + '15'} textColor={colors.darkOliveGreen}>
                        Nuevo Evento
                    </Button>
                </View>

                {eventos.length === 0 ? (
                    <EmptyState icon="timeline-text-outline" title="Sin eventos" message="No hay eventos clínicos registrados aún." />
                ) : (
                    eventos.map((evento, idx) => (
                        <View key={evento.id || idx} style={styles.timelineItem}>
                            <View style={styles.timelineLine}>
                                <View style={[styles.timelineDot, { backgroundColor: getEventColor(evento.tipo) }]}>
                                    <MaterialCommunityIcons name={getEventIcon(evento.tipo)} size={16} color={colors.white} />
                                </View>
                                {idx < eventos.length - 1 && <View style={styles.timelineConnector} />}
                            </View>
                            <Surface style={styles.eventCard} elevation={1}>
                                <View style={styles.eventHeader}>
                                    <View style={[styles.eventChip, { backgroundColor: getEventColor(evento.tipo) + '15' }]}>
                                        <Text style={{ color: getEventColor(evento.tipo), fontSize: 11, fontWeight: '600' }}>
                                            {evento.tipo?.charAt(0).toUpperCase() + evento.tipo?.slice(1)}
                                        </Text>
                                    </View>
                                    <Text style={styles.eventDate}>{formatDate(evento.fecha)}</Text>
                                </View>
                                <Text style={styles.eventDesc}>{evento.descripcion}</Text>
                                {evento.sintomas && (
                                    <View style={styles.eventDetail}>
                                        <Text style={styles.eventDetailLabel}>Síntomas:</Text>
                                        <Text style={styles.eventDetailText}>{evento.sintomas}</Text>
                                    </View>
                                )}
                                {evento.diagnostico && (
                                    <View style={styles.eventDetail}>
                                        <Text style={styles.eventDetailLabel}>Diagnóstico:</Text>
                                        <Text style={styles.eventDetailText}>{evento.diagnostico}</Text>
                                    </View>
                                )}
                                {evento.tratamiento && (
                                    <View style={styles.eventDetail}>
                                        <Text style={styles.eventDetailLabel}>Tratamiento:</Text>
                                        <Text style={styles.eventDetailText}>{evento.tratamiento}</Text>
                                    </View>
                                )}
                            </Surface>
                        </View>
                    ))
                )}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
    },
    content: {
        flex: 1,
        padding: 12,
        paddingBottom: 32,
    },
    contentDesktop: {
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },

    // Desktop layout
    desktopGrid: {
        flexDirection: 'row',
        minHeight: 600,
    },
    sidebar: {
        width: 280,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 14,
        marginRight: 16,
    },
    sidebarTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginBottom: 12,
    },
    mainPanel: {
        flex: 1,
    },

    search: {
        backgroundColor: colors.gray,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchInput: {
        fontSize: 14,
        flex: 1,
        color: colors.kombuGreen,
        outlineStyle: 'none',
    },

    // Paciente list
    pacienteList: {
        maxHeight: 500,
    },
    pacienteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        marginBottom: 4,
    },
    pacienteItemActive: {
        backgroundColor: colors.darkOliveGreen + '12',
    },
    pacienteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
    },
    pacienteAvatar: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.darkOliveGreen + '18',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    pacienteAvatarText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.darkOliveGreen,
    },
    pacienteName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.kombuGreen,
    },
    pacienteSub: {
        fontSize: 12,
        color: colors.darkGray,
    },

    // Mobile selector
    selectorSection: {
        padding: 4,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.kombuGreen,
    },
    pageSubtitle: {
        fontSize: 14,
        color: colors.darkGray,
        marginBottom: 16,
    },

    // Historial content
    historialContent: {
        padding: 4,
    },
    historialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    historialName: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.kombuGreen,
    },
    historialSub: {
        fontSize: 13,
        color: colors.darkGray,
        marginTop: 2,
    },
    historialActions: {
        flexDirection: 'row',
    },

    // Stats
    historialStats: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    miniStat: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.white,
        marginHorizontal: 4,
    },
    miniStatValue: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.kombuGreen,
    },
    miniStatLabel: {
        fontSize: 11,
        color: colors.darkGray,
        marginTop: 2,
    },

    // Info card
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    infoCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginLeft: 8,
    },
    infoCardText: {
        fontSize: 13,
        color: colors.darkGray,
        lineHeight: 20,
    },

    // Timeline
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    timelineTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.kombuGreen,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    timelineLine: {
        width: 36,
        alignItems: 'center',
    },
    timelineDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    timelineConnector: {
        width: 2,
        flex: 1,
        backgroundColor: colors.fawn + '40',
        marginTop: -2,
    },
    eventCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        marginLeft: 10,
        marginBottom: 8,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    eventDate: {
        fontSize: 11,
        color: colors.fawn,
    },
    eventDesc: {
        fontSize: 14,
        color: colors.kombuGreen,
        fontWeight: '500',
        marginBottom: 8,
    },
    eventDetail: {
        flexDirection: 'row',
        marginTop: 4,
    },
    eventDetailLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.darkGray,
        width: 90,
    },
    eventDetailText: {
        fontSize: 12,
        color: colors.darkGray,
        flex: 1,
    },

    modal: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
        width: '90%',
        maxWidth: 500,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginBottom: 16,
    },
    modalInput: {
        backgroundColor: colors.gray,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
        color: colors.kombuGreen,
        minHeight: 40,
        outlineStyle: 'none',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 16,
    },
    btnCancel: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.darkGray,
    },
    btnCancelText: {
        color: colors.darkGray,
        fontWeight: '600',
    },
    btnSave: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.darkOliveGreen,
    },
    btnSaveText: {
        color: colors.white,
        fontWeight: '600',
    },
    actionBtn: {
        padding: 8,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.kombuGreen,
        marginBottom: 4,
    },
    radioRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.gray,
        marginRight: 8,
        marginBottom: 6,
    },
    radioOptionActive: {
        backgroundColor: colors.darkOliveGreen + '18',
    },
    radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.darkGray,
        marginRight: 6,
    },
    radioCircleActive: {
        borderColor: colors.darkOliveGreen,
        backgroundColor: colors.darkOliveGreen,
    },
    radioLabel: {
        fontSize: 13,
        color: colors.darkGray,
    },
    radioLabelActive: {
        color: colors.darkOliveGreen,
        fontWeight: '600',
    },
});

export default HistorialScreen;
