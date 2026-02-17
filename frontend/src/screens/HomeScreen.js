import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.welcome}>
                    Hola, {user?.nombre?.split(' ')[0]} 👋
                </Text>
                <Text variant="bodyLarge" style={styles.role}>
                    {user?.rol === 'medico' ? 'Médico General' : 'Personal de Salud'}
                </Text>
            </View>

            <Surface style={styles.statsCard} elevation={2}>
                <Text variant="titleMedium" style={styles.cardTitle}>Resumen del día</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text variant="displaySmall" style={styles.statNumber}>12</Text>
                        <Text variant="labelMedium">Pacientes</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="displaySmall" style={styles.statNumber}>5</Text>
                        <Text variant="labelMedium">Diagnósticos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="displaySmall" style={styles.statNumber}>3</Text>
                        <Text variant="labelMedium">Pendientes</Text>
                    </View>
                </View>
            </Surface>

            <Button
                mode="outlined"
                onPress={logout}
                style={styles.logoutButton}
                textColor={colors.error}
            >
                Cerrar Sesión
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    welcome: {
        color: colors.kombuGreen,
        fontWeight: 'bold',
    },
    role: {
        color: colors.darkOliveGreen,
    },
    statsCard: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        color: colors.darkOliveGreen,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        color: colors.liver,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 'auto',
        borderColor: colors.error,
    }
});

export default HomeScreen;
