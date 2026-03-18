/**
 * ZAIRE Healthcare — HomeScreen (Dashboard Principal)
 * Pantalla de inicio con: avatar del doctor, estadísticas en tiempo real,
 * actividad reciente, accesos rápidos. Diseño responsive móvil/laptop.
 * 
 * Basado en el boceto del usuario: avatar arriba, resumen del día con stats,
 * actividad reciente (últimas consultas), y accesos rápidos a módulos.
 */
import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { Text, Surface, Button, Divider, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';
import { traducirDiagnostico } from '../constants/traducciones';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardService from '../services/DashboardService';
import { DesktopNavContext } from '../navigation/MainNavigator';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const { navigateToTab } = useContext(DesktopNavContext);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ── Animación de entrada: fade + scale ──
    const _fadeAnim  = useRef(new Animated.Value(0)).current;
    const _scaleAnim = useRef(new Animated.Value(0.96)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(_fadeAnim,  { toValue: 1, duration: 350, useNativeDriver: false }),
            Animated.spring(_scaleAnim, { toValue: 1, friction: 8, tension: 100, useNativeDriver: false }),
        ]).start();
    }, []);


    /** Cargar estadísticas del dashboard al montar. */
    const loadStats = useCallback(async () => {
        try {
            const data = await DashboardService.getEstadisticas();
            setStats(data);
        } catch (error) {
            console.log('Error cargando stats:', error);
            // Fallback: si hay error, mostrar ceros
            setStats({
                resumen: { total_pacientes: 0, total_diagnosticos: 0, pendientes: 0 },
                semana: { diagnosticos: 0, pacientes_nuevos: 0 },
                actividad_reciente: [],
                diagnosticos_frecuentes: [],
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadStats(); }, [loadStats]);

    /** Pull-to-refresh. */
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadStats();
        setRefreshing(false);
    }, [loadStats]);

    /** Obtener las iniciales del nombre del usuario. */
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
    };

    /** Obtener saludo según la hora del día. */
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    /** Mapear tipo de evento a icono. */
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

    /** Formatear fecha relativa. */
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Hace un momento';
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    };

    if (loading) return <LoadingSpinner message="Cargando dashboard..." />;

    const resumen = stats?.resumen || {};
    const actividad = stats?.actividad_reciente || [];
    const frecuentes = stats?.diagnosticos_frecuentes || [];

    return (
        <Animated.View style={[styles.screenAnim, { opacity: _fadeAnim, transform: [{ scale: _scaleAnim }] }]}>
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.darkOliveGreen]} />}
        >
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>

                {/* ===== HEADER CON BANDA VERDE ===== */}
                <View style={styles.headerBand}>
                    {/* Burbujas decorativas del header */}
                    <View style={styles.headerBubble1} pointerEvents="none" />
                    <View style={styles.headerBubble2} pointerEvents="none" />
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity
                                style={styles.avatar}
                                onPress={() => isDesktop ? navigateToTab('Perfil') : navigation.navigate('Perfil')}
                            >
                                <Text style={styles.avatarText}>{getInitials(user?.nombre)}</Text>
                            </TouchableOpacity>
                            <View style={styles.headerInfo}>
                                <Text style={styles.greeting}>{getGreeting()}</Text>
                                <Text style={styles.userName}>{user?.nombre || 'Doctor'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                            <MaterialCommunityIcons name="logout" size={22} color={colors.cornsilk} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ===== LAYOUT RESPONSIVE ===== */}
                <View style={isDesktop ? styles.desktopGrid : null}>
                    {/* COLUMNA IZQUIERDA (o todo el contenido en móvil) */}
                    <View style={isDesktop ? styles.desktopLeft : null}>

                        {/* Resumen del Día */}
                        <Text style={styles.sectionTitle}>Resumen del Día</Text>
                        <View style={styles.statsRow}>
                            <StatsCard title="Pacientes" value={resumen.total_pacientes ?? 0} icon="account-group" color={colors.darkOliveGreen} />
                            <StatsCard title="Diagnósticos" value={resumen.total_diagnosticos ?? 0} icon="brain" color={colors.liver} />
                            <StatsCard title="Pendientes" value={resumen.pendientes ?? 0} icon="clock-alert-outline" color={colors.fawn} />
                        </View>

                        {/* Accesos Rápidos */}
                        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
                        <View style={styles.quickActions}>
                            <TouchableOpacity
                                style={[styles.quickBtn, { backgroundColor: colors.darkOliveGreen }]}
                                onPress={() => isDesktop ? navigateToTab('PacientesTab', { initialRoute: 'NuevoPaciente' }) : navigation.navigate('PacientesTab', { screen: 'NuevoPaciente' })}
                            >
                                <View style={styles.quickBtnBubble} pointerEvents="none" />
                                <MaterialCommunityIcons name="account-plus" size={24} color={colors.white} />
                                <Text style={styles.quickBtnText}>Nuevo Paciente</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.quickBtn, { backgroundColor: colors.liver }]}
                                onPress={() => isDesktop ? navigateToTab('Diagnostico') : navigation.navigate('Diagnostico')}
                            >
                                <View style={styles.quickBtnBubble} pointerEvents="none" />
                                <MaterialCommunityIcons name="stethoscope" size={24} color={colors.white} />
                                <Text style={styles.quickBtnText}>Diagnóstico IA</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.quickBtn, { backgroundColor: colors.fawn }]}
                                onPress={() => isDesktop ? navigateToTab('Historial') : navigation.navigate('Historial')}
                            >
                                <View style={styles.quickBtnBubble} pointerEvents="none" />
                                <MaterialCommunityIcons name="chart-timeline-variant" size={24} color={colors.white} />
                                <Text style={styles.quickBtnText}>Historial</Text>
                            </TouchableOpacity>
                        </View>

                        {/* ═══ GRÁFICA DE DIAGNÓSTICOS FRECUENTES ═══ */}
                        {frecuentes.length > 0 && (
                            <View style={styles.chartCard}>
                                <View style={styles.chartHeader}>
                                    <MaterialCommunityIcons name="chart-bar" size={20} color={colors.darkOliveGreen} />
                                    <Text style={styles.sectionTitle}>Diagnósticos Frecuentes</Text>
                                </View>
                                {frecuentes.slice(0, 6).map((d, idx) => {
                                    const maxVal = Math.max(...frecuentes.map(f => f.total || 1));
                                    const widthPct = ((d.total || 1) / maxVal) * 100;
                                    const barColors = [
                                        colors.darkOliveGreen,
                                        colors.liver,
                                        colors.fawn,
                                        '#5B8C5A',
                                        '#8B5E3C',
                                        '#D4A373',
                                    ];
                                    return (
                                        <View key={idx} style={styles.chartRow}>
                                            <Text style={styles.chartLabel} numberOfLines={1}>
                                                {traducirDiagnostico(d.diagnostico_predicho)}
                                            </Text>
                                            <View style={styles.chartBarTrack}>
                                                <View
                                                    style={[
                                                        styles.chartBarFill,
                                                        {
                                                            width: `${widthPct}%`,
                                                            backgroundColor: barColors[idx % barColors.length],
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={[styles.chartValue, { color: barColors[idx % barColors.length] }]}>
                                                {d.total}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* Actividad Reciente (en móvil queda aquí) */}
                        {!isDesktop && (
                            <>
                                <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                                {actividad.length === 0 ? (
                                    <Surface style={styles.emptyActivity} elevation={1}>
                                        <MaterialCommunityIcons name="clipboard-text-off-outline" size={40} color={colors.fawn} />
                                        <Text style={styles.emptyText}>Sin actividad reciente</Text>
                                    </Surface>
                                ) : (
                                    <Surface style={styles.activityCard} elevation={1}>
                                        {actividad.map((evento, idx) => (
                                            <View key={evento.id || idx}>
                                                <View style={styles.activityItem}>
                                                    <View style={[styles.activityIcon, { backgroundColor: colors.darkOliveGreen + '15' }]}>
                                                        <MaterialCommunityIcons name={getEventIcon(evento.tipo)} size={20} color={colors.darkOliveGreen} />
                                                    </View>
                                                    <View style={styles.activityInfo}>
                                                        <Text style={styles.activityTitle} numberOfLines={1}>
                                                            {evento.diagnostico || evento.tipo}
                                                        </Text>
                                                        <Text style={styles.activitySubtitle} numberOfLines={1}>
                                                            {evento.historial__paciente__nombre}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.activityDate}>{formatDate(evento.fecha)}</Text>
                                                </View>
                                                {idx < actividad.length - 1 && <Divider />}
                                            </View>
                                        ))}
                                    </Surface>
                                )}
                            </>
                        )}
                    </View>

                    {/* COLUMNA DERECHA (solo en desktop) */}
                    {isDesktop && (
                        <View style={styles.desktopRight}>
                            {/* Stats de la semana */}
                            <Surface style={styles.weekCard} elevation={2}>
                                <Text style={styles.weekTitle}>Esta Semana</Text>
                                <View style={styles.weekRow}>
                                    <View style={styles.weekStat}>
                                        <Text style={styles.weekValue}>{stats?.semana?.diagnosticos ?? 0}</Text>
                                        <Text style={styles.weekLabel}>Diagnósticos</Text>
                                    </View>
                                    <View style={styles.weekDivider} />
                                    <View style={styles.weekStat}>
                                        <Text style={styles.weekValue}>{stats?.semana?.pacientes_nuevos ?? 0}</Text>
                                        <Text style={styles.weekLabel}>Pacientes Nuevos</Text>
                                    </View>
                                </View>
                            </Surface>

                            {/* Actividad Reciente */}
                            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                            <Surface style={styles.activityCard} elevation={1}>
                                {actividad.length === 0 ? (
                                    <View style={styles.emptyActivity}>
                                        <MaterialCommunityIcons name="clipboard-text-off-outline" size={40} color={colors.fawn} />
                                        <Text style={styles.emptyText}>Sin actividad</Text>
                                    </View>
                                ) : (
                                    actividad.map((evento, idx) => (
                                        <View key={evento.id || idx}>
                                            <View style={styles.activityItem}>
                                                <View style={[styles.activityIcon, { backgroundColor: colors.darkOliveGreen + '15' }]}>
                                                    <MaterialCommunityIcons name={getEventIcon(evento.tipo)} size={20} color={colors.darkOliveGreen} />
                                                </View>
                                                <View style={styles.activityInfo}>
                                                    <Text style={styles.activityTitle} numberOfLines={1}>
                                                        {evento.diagnostico || evento.tipo}
                                                    </Text>
                                                    <Text style={styles.activitySubtitle} numberOfLines={1}>
                                                        {evento.historial__paciente__nombre}
                                                    </Text>
                                                </View>
                                                <Text style={styles.activityDate}>{formatDate(evento.fecha)}</Text>
                                            </View>
                                            {idx < actividad.length - 1 && <Divider />}
                                        </View>
                                    ))
                                )}
                            </Surface>

                            {/* Diagnósticos frecuentes */}
                            {frecuentes.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Top Diagnósticos</Text>
                                    <Surface style={styles.activityCard} elevation={1}>
                                        {frecuentes.map((d, idx) => (
                                            <View key={idx} style={styles.freqItem}>
                                                <View style={[styles.freqBadge, { backgroundColor: colors.fawn + '25' }]}>
                                                    <Text style={styles.freqNum}>{idx + 1}</Text>
                                                </View>
                                                <Text style={styles.freqLabel} numberOfLines={1}>
                                                    {traducirDiagnostico(d.diagnostico_predicho)}
                                                </Text>
                                                <Badge style={styles.freqCount}>{d.total}</Badge>
                                            </View>
                                        ))}
                                    </Surface>
                                </>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    screenAnim: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    contentDesktop: {
        maxWidth: 1100,
        alignSelf: 'center',
        width: '100%',
    },

    // Header band
    headerBand: {
        backgroundColor: colors.kombuGreen,
        borderRadius: 20,
        marginBottom: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    headerBubble1: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: -70,
        right: -50,
    },
    headerBubble2: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(221,161,94,0.12)',
        bottom: -40,
        left: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '700',
    },
    headerInfo: {
        marginLeft: 14,
    },
    greeting: {
        fontSize: 13,
        color: colors.cornsilk + 'BB',
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.cornsilk,
    },
    logoutBtn: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    // Sections
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginTop: 20,
        marginBottom: 12,
        paddingLeft: 10,
        borderLeftWidth: 3,
        borderLeftColor: colors.fawn,
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: -6,
    },

    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickBtn: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 20,
        paddingHorizontal: 8,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        position: 'relative',
    },
    quickBtnBubble: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.12)',
        top: -25,
        right: -20,
    },
    quickBtnText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '700',
        marginTop: 8,
        textAlign: 'center',
    },

    // Activity
    activityCard: {
        borderRadius: 16,
        backgroundColor: colors.white,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: colors.kombuGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderLeftWidth: 3,
        borderLeftColor: colors.darkOliveGreen + '40',
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.kombuGreen,
    },
    activitySubtitle: {
        fontSize: 12,
        color: colors.darkGray,
        marginTop: 2,
    },
    activityDate: {
        fontSize: 11,
        color: colors.fawn,
        fontWeight: '500',
    },
    emptyActivity: {
        alignItems: 'center',
        padding: 30,
        borderRadius: 16,
        backgroundColor: colors.white,
    },
    emptyText: {
        marginTop: 8,
        color: colors.darkGray,
        fontSize: 13,
    },

    // Desktop grid
    desktopGrid: {
        flexDirection: 'row',
    },
    desktopLeft: {
        flex: 1,
        marginRight: 20,
    },
    desktopRight: {
        width: 340,
    },

    // Week stats
    weekCard: {
        borderRadius: 16,
        backgroundColor: colors.white,
        padding: 20,
        marginTop: 20,
    },
    weekTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.kombuGreen,
        marginBottom: 16,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    weekStat: {
        alignItems: 'center',
    },
    weekValue: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.liver,
    },
    weekLabel: {
        fontSize: 12,
        color: colors.darkGray,
        marginTop: 4,
    },
    weekDivider: {
        width: 1,
        backgroundColor: colors.gray,
    },

    // Frequent diagnoses
    freqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    freqBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    freqNum: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.fawn,
    },
    freqLabel: {
        flex: 1,
        fontSize: 13,
        color: colors.kombuGreen,
    },
    freqCount: {
        backgroundColor: colors.darkOliveGreen,
    },

    // ─── Gráfica de barras ───
    chartCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
        elevation: 2,
        shadowColor: colors.kombuGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    chartRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    chartLabel: {
        width: 110,
        fontSize: 12,
        color: colors.kombuGreen,
        fontWeight: '500',
    },
    chartBarTrack: {
        flex: 1,
        height: 18,
        backgroundColor: colors.gray,
        borderRadius: 9,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    chartBarFill: {
        height: '100%',
        borderRadius: 9,
        minWidth: 8,
    },
    chartValue: {
        width: 28,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default HomeScreen;