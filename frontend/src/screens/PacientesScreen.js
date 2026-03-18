/**
 * ZAIRE Healthcare — PacientesScreen
 * Pantalla de gestión de pacientes (CRUD) con diseño responsive.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View, FlatList, StyleSheet, Alert,
    useWindowDimensions, RefreshControl, TouchableOpacity,
    TextInput as RNTextInput, Animated,
} from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../constants/colors';
import PacientesService from '../services/PacientesService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const PacientesScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    // ── Animación de entrada: fade ──
    const _fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(_fadeAnim, { toValue: 1, duration: 350, useNativeDriver: false }).start();
    }, []);

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [filtroSexo, setFiltroSexo] = useState(null);

    useFocusEffect(useCallback(() => { loadPacientes(); }, []));

    const loadPacientes = async () => {
        try {
            const data = await PacientesService.getPacientes();
            setPacientes(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.log('Error cargando pacientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPacientes();
        setRefreshing(false);
    }, []);

    const filteredPacientes = pacientes.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
            (p.contacto && p.contacto.includes(search));
        const matchSexo = !filtroSexo || p.sexo === filtroSexo;
        return matchSearch && matchSexo;
    });

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    };

    const renderPaciente = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, isDesktop && styles.cardDesktop]}
            onPress={() => navigation.navigate('DetallePaciente', { pacienteId: item.id })}
            activeOpacity={0.7}
        >
            <Surface style={styles.cardInner} elevation={2}>
                {/* Acento de color según sexo */}
                <View style={[styles.cardAccent, { backgroundColor: item.sexo === 'F' ? colors.fawn : colors.darkOliveGreen }]} />
                <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: item.sexo === 'F' ? colors.fawn + '25' : colors.darkOliveGreen + '18' }]}>
                        <MaterialCommunityIcons
                            name={item.sexo === 'F' ? 'face-woman' : 'face-man'}
                            size={24}
                            color={item.sexo === 'F' ? colors.fawn : colors.darkOliveGreen}
                        />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardName} numberOfLines={1}>{item.nombre}</Text>
                        <Text style={styles.cardSub}>
                            {item.edad} años • {item.sexo === 'M' ? 'Masculino' : 'Femenino'}
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={colors.fawn} />
                </View>

                <Divider style={styles.cardDivider} />

                <View style={styles.cardDetails}>
                    {item.contacto && (
                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="phone" size={16} color={colors.darkGray} />
                            <Text style={styles.detailText}>{item.contacto}</Text>
                        </View>
                    )}
                    {item.direccion && (
                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.darkGray} />
                            <Text style={styles.detailText} numberOfLines={1}>{item.direccion}</Text>
                        </View>
                    )}
                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={styles.actionChip}
                            onPress={() => navigation.navigate('Historial', { pacienteId: item.id })}
                        >
                            <MaterialCommunityIcons name="clipboard-text-clock" size={14} color={colors.darkOliveGreen} />
                            <Text style={styles.actionChipText}>Historial</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionChip, { backgroundColor: colors.liver + '12' }]}
                            onPress={() => navigation.navigate('Diagnostico', { pacienteId: item.id })}
                        >
                            <MaterialCommunityIcons name="brain" size={14} color={colors.liver} />
                            <Text style={[styles.actionChipText, { color: colors.liver }]}>IA</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Surface>
        </TouchableOpacity>
    );

    if (loading) return <LoadingSpinner message="Cargando pacientes..." />;

    return (
        <Animated.View style={[styles.container, { opacity: _fadeAnim }]}>
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>

            {/* ── HEADER con líneas + icono decorativo flotante ── */}
            <View style={styles.headerBand}>
                {/* Líneas decorativas */}
                {[0,1,2,3,4].map(i => (
                    <View key={i} style={[styles.headerLine, { top: i * 20 - 10, transform: [{ rotate: '-12deg' }] }]} pointerEvents="none" />
                ))}
                {/* Círculo decorativo fondo */}
                <View style={styles.headerCircle1} pointerEvents="none" />
                <View style={styles.headerCircle2} pointerEvents="none" />
                {/* Icono decorativo con fondo */}
                <View style={styles.headerBigIcon} pointerEvents="none">
                    <MaterialCommunityIcons name="account-group" size={64} color={colors.cornsilk} />
                </View>
                {/* Contenido */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Pacientes</Text>
                        <Text style={styles.count}>{filteredPacientes.length} registrados</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons name="account-group" size={26} color={colors.cornsilk} />
                    </View>
                </View>
            </View>

            {/* Búsqueda */}
            <View style={styles.search}>
                <MaterialCommunityIcons name="magnify" size={20} color={colors.darkOliveGreen} style={{ marginRight: 8 }} />
                <RNTextInput
                    placeholder="Buscar por nombre o contacto..."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    placeholderTextColor={colors.darkGray}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <MaterialCommunityIcons name="close-circle" size={18} color={colors.darkGray} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filtros */}
            <View style={styles.filters}>
                {[{ label: 'Todos', val: null }, { label: 'Masculino', val: 'M' }, { label: 'Femenino', val: 'F' }].map(f => (
                    <TouchableOpacity
                        key={f.label}
                        style={[styles.filterChip, filtroSexo === f.val && styles.filterChipActive]}
                        onPress={() => setFiltroSexo(filtroSexo === f.val ? null : f.val)}
                    >
                        <Text style={filtroSexo === f.val ? styles.filterChipTextActive : styles.filterChipText}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Lista */}
            {filteredPacientes.length === 0 ? (
                <EmptyState
                    icon="account-search-outline"
                    title="Sin resultados"
                    message={search ? 'No se encontraron pacientes con ese criterio.' : 'No hay pacientes registrados aún.'}
                />
            ) : (
                <FlatList
                    data={filteredPacientes}
                    renderItem={renderPaciente}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={isDesktop ? 2 : 1}
                    key={isDesktop ? 'desktop' : 'mobile'}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.darkOliveGreen]} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>

        {/* FAB */}
        <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('NuevoPaciente')}
            activeOpacity={0.85}
        >
            <MaterialCommunityIcons name="plus" size={24} color={colors.white} />
            {isDesktop && <Text style={styles.fabLabel}>Nuevo Paciente</Text>}
        </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.cornsilk },
    content: { flex: 1, padding: 14 },
    contentDesktop: { maxWidth: 1000, alignSelf: 'center', width: '100%' },

    // ── Header band ──
    headerBand: {
        backgroundColor: colors.kombuGreen,
        borderRadius: 20,
        marginBottom: 14,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 96,
    },
    // Líneas decorativas diagonales
    headerLine: {
        position: 'absolute',
        left: -20,
        right: -20,
        height: 1.5,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    // Círculos de fondo
    headerCircle1: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 18,
        borderColor: 'rgba(255,255,255,0.05)',
        right: 20,
        top: -40,
    },
    headerCircle2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 12,
        borderColor: 'rgba(255,255,255,0.06)',
        right: 90,
        top: 20,
    },
    // Icono decorativo con caja
    headerBigIcon: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        opacity: 0.12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        position: 'relative',
        zIndex: 1,
    },
    headerIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { fontSize: 22, fontWeight: '700', color: colors.cornsilk },
    count: { fontSize: 13, color: colors.cornsilk + 'BB', marginTop: 2 },

    // Search
    search: {
        backgroundColor: colors.white,
        borderRadius: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        elevation: 2,
        shadowColor: colors.kombuGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    searchInput: { fontSize: 14, flex: 1, color: colors.kombuGreen, outlineStyle: 'none' },

    // Filters
    filters: { flexDirection: 'row', marginBottom: 14 },
    filterChip: {
        marginRight: 8,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    filterChipActive: {
        backgroundColor: colors.darkOliveGreen,
        elevation: 3,
        shadowColor: colors.darkOliveGreen,
        shadowOpacity: 0.3,
    },
    filterChipText: { color: colors.darkGray, fontWeight: '500' },
    filterChipTextActive: { color: colors.white, fontWeight: '700' },

    // Card
    card: { flex: 1, paddingHorizontal: 2, marginBottom: 10 },
    cardDesktop: { maxWidth: '50%', paddingHorizontal: 6 },
    cardInner: {
        borderRadius: 16,
        backgroundColor: colors.white,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: colors.kombuGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    // Acento superior de color
    cardAccent: {
        height: 4,
        width: '100%',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
    avatar: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    cardInfo: { flex: 1 },
    cardName: { fontSize: 15, fontWeight: '700', color: colors.kombuGreen },
    cardSub: { fontSize: 12, color: colors.darkGray, marginTop: 2 },
    cardDivider: { marginHorizontal: 14 },
    cardDetails: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 10 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    detailText: { fontSize: 13, color: colors.darkGray, marginLeft: 8, flex: 1 },
    cardActions: { flexDirection: 'row', marginTop: 8 },
    actionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkOliveGreen + '12',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    actionChipText: { fontSize: 12, color: colors.darkOliveGreen, fontWeight: '600', marginLeft: 4 },

    // List
    listContent: { paddingBottom: 80 },

    // FAB
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: colors.darkOliveGreen,
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 6,
        shadowColor: colors.darkOliveGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
    },
    fabLabel: { color: colors.white, fontWeight: '700', fontSize: 14, marginLeft: 8 },
});

export default PacientesScreen;