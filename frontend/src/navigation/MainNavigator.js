import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';

// Pantallas
import HomeScreen from '../screens/HomeScreen';
import PacientesScreen from '../screens/PacientesScreen';
import DiagnosticoScreen from '../screens/DiagnosticoScreen';
import HistorialScreen from '../screens/HistorialScreen';

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
                    borderTopColor: colors.fawn,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-variant" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Pacientes"
                component={PacientesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-group" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Diagnóstico"
                component={DiagnosticoScreen}
                options={{
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
