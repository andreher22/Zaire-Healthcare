/**
 * ZAIRE Healthcare — MainNavigator
 * Navegación principal con tabs inferiores y stacks anidados.
 * Tabs: Inicio, Pacientes, Diagnóstico IA, Historial.
 * Incluye ruta modal para Perfil accesible desde HomeScreen.
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../constants/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PacientesScreen from '../screens/PacientesScreen';
import NuevoPacienteScreen from '../screens/NuevoPacienteScreen';
import DetallePacienteScreen from '../screens/DetallePacienteScreen';
import DiagnosticoScreen from '../screens/DiagnosticoScreen';
import HistorialScreen from '../screens/HistorialScreen';
import PerfilScreen from '../screens/PerfilScreen';

// ===== Stacks anidados =====

const HomeStack = createStackNavigator();
/** Stack de Inicio: Home → Perfil */
const HomeNavigator = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen
            name="HomeMain"
            component={HomeScreen}
            options={{ headerShown: false }}
        />
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

const PacientesStack = createStackNavigator();
/** Stack de Pacientes: Lista → Nuevo → Detalle */
const PacientesNavigator = () => (
    <PacientesStack.Navigator>
        <PacientesStack.Screen
            name="ListaPacientes"
            component={PacientesScreen}
            options={{ headerShown: false }}
        />
        <PacientesStack.Screen
            name="NuevoPaciente"
            component={NuevoPacienteScreen}
            options={{
                title: 'Registrar Paciente',
                headerStyle: { backgroundColor: colors.white },
                headerTintColor: colors.kombuGreen,
                headerTitleStyle: { fontWeight: '700' },
            }}
        />
        <PacientesStack.Screen
            name="DetallePaciente"
            component={DetallePacienteScreen}
            options={{
                title: 'Detalle del Paciente',
                headerStyle: { backgroundColor: colors.white },
                headerTintColor: colors.kombuGreen,
                headerTitleStyle: { fontWeight: '700' },
            }}
        />
    </PacientesStack.Navigator>
);

// ===== Tab Navigator =====

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return (
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
            <Tab.Screen
                name="Inicio"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-variant" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="PacientesTab"
                component={PacientesNavigator}
                options={{
                    tabBarLabel: 'Pacientes',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-group" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Diagnostico"
                component={DiagnosticoScreen}
                options={{
                    tabBarLabel: 'Diagnóstico',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="brain" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Historial"
                component={HistorialScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="clipboard-text-clock" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
