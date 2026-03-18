/**
 * ZAIRE Healthcare — MainNavigator
 * Navegación responsive:
 * - Desktop (>768px): Sidebar vertical a la izquierda
 * - Móvil:           Bottom tabs abajo
 */
import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import {
    View, TouchableOpacity, StyleSheet,
    useWindowDimensions, ScrollView, Animated,
} from 'react-native';
import { Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────
// CONTEXTO — permite a cualquier screen cambiar el tab activo en desktop
// ─────────────────────────────────────────
export const DesktopNavContext = createContext({ navigateToTab: () => {} });


// Screens
import HomeScreen from '../screens/HomeScreen';
import PacientesScreen from '../screens/PacientesScreen';
import NuevoPacienteScreen from '../screens/NuevoPacienteScreen';
import DetallePacienteScreen from '../screens/DetallePacienteScreen';
import DiagnosticoScreen from '../screens/DiagnosticoScreen';
import HistorialScreen from '../screens/HistorialScreen';
import PerfilScreen from '../screens/PerfilScreen';

// ─────────────────────────────────────────
// STACKS ANIDADOS (compartidos entre ambos modos)
// ─────────────────────────────────────────

const HomeStack = createStackNavigator();
const HomeNavigator = () => (
    <HomeStack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.cornsilk },
            cardStyleInterpolator: fadeFromRight,
            transitionSpec: {
                open:  { animation: 'timing', config: { duration: 280 } },
                close: { animation: 'timing', config: { duration: 220 } },
            },
        }}
    >
        <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
        <HomeStack.Screen
            name="Perfil"
            component={PerfilScreen}
            options={{
                title: 'Mi Perfil',
                headerStyle: { backgroundColor: colors.white },
                headerTintColor: colors.kombuGreen,
                headerTitleStyle: { fontWeight: '700' },
            }}
        />
    </HomeStack.Navigator>
);

const fadeFromRight = ({ current, layouts }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

const PacientesStack = createStackNavigator();
const PacientesNavigator = ({ initialRouteName = 'ListaPacientes' }) => (
    <PacientesStack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.cornsilk },
            cardStyleInterpolator: fadeFromRight,
            transitionSpec: {
                open:  { animation: 'timing', config: { duration: 280 } },
                close: { animation: 'timing', config: { duration: 220 } },
            },
        }}
    >
        <PacientesStack.Screen name="ListaPacientes" component={PacientesScreen} options={{ headerShown: false }} />
        <PacientesStack.Screen name="NuevoPaciente" component={NuevoPacienteScreen} options={{ headerShown: false }} />
        <PacientesStack.Screen name="DetallePaciente" component={DetallePacienteScreen} options={{ headerShown: false }} />
    </PacientesStack.Navigator>
);

// ─────────────────────────────────────────
// ITEMS DE NAVEGACIÓN (fuente única de verdad)
// ─────────────────────────────────────────
const NAV_ITEMS = [
    { name: 'Inicio',       label: 'Inicio',      icon: 'home-variant',        component: HomeNavigator },
    { name: 'PacientesTab', label: 'Pacientes',   icon: 'account-group',       component: PacientesNavigator },
    { name: 'Diagnostico',  label: 'Diagnóstico', icon: 'brain',               component: DiagnosticoScreen },
    { name: 'Historial',    label: 'Historial',   icon: 'clipboard-text-clock', component: HistorialScreen },
];

// ─────────────────────────────────────────
// SIDEBAR — Solo se muestra en desktop
// ─────────────────────────────────────────
const Sidebar = ({ activeTab, onTabPress, user, onLogout, onPerfilPress }) => {
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
    };

    const getRolLabel = (rol) => {
        const roles = { admin: 'Administrador', medico: 'Médico', enfermero: 'Enfermero' };
        return roles[rol] || rol;
    };

    // Pulso sutil en el logo
    const logoPulse = useRef(new Animated.Value(1)).current;

    // Burbujas flotantes
    const bubble1Y = useRef(new Animated.Value(0)).current;
    const bubble1X = useRef(new Animated.Value(0)).current;
    const bubble2Y = useRef(new Animated.Value(0)).current;
    const bubble2X = useRef(new Animated.Value(0)).current;
    const bubble3Y = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoPulse, { toValue: 1.07, duration: 1800, useNativeDriver: false }),
                Animated.timing(logoPulse, { toValue: 1.0,  duration: 1800, useNativeDriver: false }),
            ])
        ).start();

        // Burbuja 1 — flota lento diagonal
        Animated.loop(
            Animated.sequence([
                Animated.timing(bubble1Y, { toValue: -18, duration: 6000, useNativeDriver: false }),
                Animated.timing(bubble1Y, { toValue: 0,   duration: 6000, useNativeDriver: false }),
            ])
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(bubble1X, { toValue: 10,  duration: 7000, useNativeDriver: false }),
                Animated.timing(bubble1X, { toValue: 0,   duration: 7000, useNativeDriver: false }),
            ])
        ).start();

        // Burbuja 2 — movimiento opuesto, más lento
        Animated.loop(
            Animated.sequence([
                Animated.timing(bubble2Y, { toValue: 14,  duration: 8000, useNativeDriver: false }),
                Animated.timing(bubble2Y, { toValue: 0,   duration: 8000, useNativeDriver: false }),
            ])
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(bubble2X, { toValue: -8,  duration: 9000, useNativeDriver: false }),
                Animated.timing(bubble2X, { toValue: 0,   duration: 9000, useNativeDriver: false }),
            ])
        ).start();

        // Burbuja 3 — solo vertical, muy lento
        Animated.loop(
            Animated.sequence([
                Animated.timing(bubble3Y, { toValue: -12, duration: 10000, useNativeDriver: false }),
                Animated.timing(bubble3Y, { toValue: 0,   duration: 10000, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.sidebar}>
            {/* Burbujas decorativas flotantes */}
            <Animated.View style={[styles.sidebarBubble1, { transform: [{ translateY: bubble1Y }, { translateX: bubble1X }] }]} pointerEvents="none" />
            <Animated.View style={[styles.sidebarBubble2, { transform: [{ translateY: bubble2Y }, { translateX: bubble2X }] }]} pointerEvents="none" />
            <Animated.View style={[styles.sidebarBubble3, { transform: [{ translateY: bubble3Y }] }]} pointerEvents="none" />

            {/* Logo */}
            <View style={styles.sidebarLogo}>
                <Animated.View style={[styles.sidebarLogoIcon, { transform: [{ scale: logoPulse }] }]}>
                    <Text style={{ fontSize: 22 }}>🏥</Text>
                </Animated.View>
                <View>
                    <Text style={styles.sidebarLogoTitle}>ZAIRE</Text>
                    <Text style={styles.sidebarLogoSub}>Healthcare</Text>
                </View>
            </View>

            <View style={styles.sidebarDivider} />

            {/* Navegación */}
            <ScrollView style={styles.sidebarNav} showsVerticalScrollIndicator={false}>
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.name;
                    return (
                        <TouchableOpacity
                            key={item.name}
                            style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                            onPress={() => onTabPress(item.name)}
                            activeOpacity={0.7}
                        >
                            {isActive && <View style={styles.sidebarItemGlow} pointerEvents="none" />}
                            <Icon
                                name={item.icon}
                                size={22}
                                color={isActive ? colors.white : colors.cornsilk + 'AA'}
                            />
                            <Text style={[styles.sidebarLabel, isActive && styles.sidebarLabelActive]}>
                                {item.label}
                            </Text>
                            {isActive && <View style={styles.sidebarActiveIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.sidebarDivider} />

            {/* Usuario + Logout */}
            <View style={styles.sidebarFooter}>
                <TouchableOpacity
                    style={[styles.sidebarUser, activeTab === 'Perfil' && styles.sidebarUserActive]}
                    onPress={onPerfilPress}
                    activeOpacity={0.7}
                >
                    <View style={[styles.sidebarAvatar, activeTab === 'Perfil' && styles.sidebarAvatarActive]}>
                        <Text style={styles.sidebarAvatarText}>{getInitials(user?.nombre)}</Text>
                    </View>
                    <View style={styles.sidebarUserInfo}>
                        <Text style={styles.sidebarUserName} numberOfLines={1}>{user?.nombre}</Text>
                        <Text style={styles.sidebarUserRol}>{getRolLabel(user?.rol)}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarLogout} onPress={onLogout}>
                    <Icon name="logout" size={20} color={colors.fawn} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ─────────────────────────────────────────
// LAYOUT DESKTOP — Sidebar + Contenido
// ─────────────────────────────────────────
const DesktopLayout = () => {
    const [activeTab, setActiveTab] = useState('Inicio');
    const [tabParams, setTabParams] = useState(null);
    const { user, logout } = useAuth();

    // Animación de entrada inicial
    const sidebarX   = useRef(new Animated.Value(-220)).current;
    const sidebarOp  = useRef(new Animated.Value(0)).current;
    const contentOp  = useRef(new Animated.Value(0)).current;
    const contentY   = useRef(new Animated.Value(18)).current;

    // Animación de cambio de tab
    const tabFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(sidebarX,  { toValue: 0, friction: 9, tension: 70, useNativeDriver: false }),
            Animated.timing(sidebarOp, { toValue: 1, duration: 350, useNativeDriver: false }),
            Animated.timing(contentOp, { toValue: 1, duration: 450, delay: 180, useNativeDriver: false }),
            Animated.spring(contentY,  { toValue: 0, friction: 10, tension: 80, delay: 180, useNativeDriver: false }),
        ]).start();
    }, []);

    const handleTabPress = (tab, params = null) => {
        Animated.timing(tabFade, { toValue: 0, duration: 120, useNativeDriver: false }).start(() => {
            setTabParams(params);
            setActiveTab(tab);
            Animated.timing(tabFade, { toValue: 1, duration: 220, useNativeDriver: false }).start();
        });
    };

    const ActiveComponent = activeTab === 'Perfil'
        ? PerfilScreen
        : NAV_ITEMS.find(item => item.name === activeTab)?.component || HomeNavigator;

    const activeProps = (activeTab === 'PacientesTab' && tabParams?.initialRoute)
        ? { initialRouteName: tabParams.initialRoute }
        : {};

    return (
        <DesktopNavContext.Provider value={{ navigateToTab: handleTabPress }}>
        <View style={styles.desktopContainer}>
            <Animated.View style={[{ transform: [{ translateX: sidebarX }], opacity: sidebarOp }]}>
                <Sidebar
                    activeTab={activeTab}
                    onTabPress={handleTabPress}
                    user={user}
                    onLogout={logout}
                    onPerfilPress={() => handleTabPress('Perfil')}
                />
            </Animated.View>
            <Animated.View style={[styles.desktopContent, { opacity: contentOp, transform: [{ translateY: contentY }] }]}>
                <Animated.View style={{ flex: 1, opacity: tabFade }}>
                    <ActiveComponent key={activeTab} tabParams={tabParams} {...activeProps} />
                </Animated.View>
            </Animated.View>
        </View>
        </DesktopNavContext.Provider>
    );
};

// ─────────────────────────────────────────
// BOTTOM TABS — Solo en móvil
// ─────────────────────────────────────────
const Tab = createBottomTabNavigator();

const MobileLayout = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.darkOliveGreen,
            tabBarInactiveTintColor: colors.fawn,
            tabBarStyle: {
                backgroundColor: colors.white,
                borderTopColor: colors.gray,
                height: 64,
                paddingBottom: 10,
                paddingTop: 6,
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
            },
        }}
    >
        {NAV_ITEMS.map((item) => (
            <Tab.Screen
                key={item.name}
                name={item.name}
                component={item.component}
                options={{
                    tabBarLabel: item.label,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name={item.icon} color={color} size={size} />
                    ),
                }}
            />
        ))}
    </Tab.Navigator>
);

// ─────────────────────────────────────────
// MAIN NAVIGATOR — Decide qué mostrar
// ─────────────────────────────────────────
const MainNavigator = () => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    return isDesktop ? <DesktopLayout /> : <MobileLayout />;
};

// ─────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────
const styles = StyleSheet.create({
    // Desktop
    desktopContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.cornsilk,
        height: '100vh',
    },
    desktopContent: {
        flex: 1,
        backgroundColor: colors.cornsilk,
        height: '100vh',
        overflow: 'auto',
    },
    desktopContentInner: {
        flexGrow: 1,
    },

    // Sidebar
    sidebar: {
        width: 220,
        height: '100vh',
        backgroundColor: colors.kombuGreen,
        paddingTop: 24,
        paddingBottom: 16,
        flexDirection: 'column',
        overflow: 'hidden',
    },
    // Burbujas decorativas
    sidebarBubble1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.07)',
        top: -70,
        right: -70,
    },
    sidebarBubble2: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(221,161,94,0.10)',
        top: 100,
        left: -45,
    },
    sidebarBubble3: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.05)',
        bottom: 50,
        right: -60,
    },
    // Glow en item activo
    sidebarItemGlow: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    sidebarLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sidebarLogoIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sidebarLogoTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: colors.cornsilk,
        letterSpacing: 3,
    },
    sidebarLogoSub: {
        fontSize: 11,
        color: colors.fawn,
        fontWeight: '500',
        letterSpacing: 1,
    },
    sidebarDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    sidebarNav: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginBottom: 4,
        position: 'relative',
    },
    sidebarItemActive: {
        backgroundColor: colors.darkOliveGreen,
    },
    sidebarLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.cornsilk + 'AA',
        marginLeft: 12,
    },
    sidebarLabelActive: {
        color: colors.white,
        fontWeight: '700',
    },
    sidebarActiveIndicator: {
        position: 'absolute',
        right: 0,
        top: '25%',
        width: 4,
        height: '50%',
        backgroundColor: colors.fawn,
        borderRadius: 2,
    },

    // Footer del sidebar
    sidebarFooter: {
        paddingHorizontal: 12,
        paddingTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sidebarUser: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    sidebarUserActive: {
        backgroundColor: colors.darkOliveGreen,
    },
    sidebarAvatar: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.darkOliveGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sidebarAvatarActive: {
        backgroundColor: colors.fawn,
    },
    sidebarAvatarText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    sidebarUserInfo: {
        flex: 1,
    },
    sidebarUserName: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.cornsilk,
    },
    sidebarUserRol: {
        fontSize: 11,
        color: colors.fawn,
        marginTop: 1,
    },
    sidebarLogout: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
});

export default MainNavigator;