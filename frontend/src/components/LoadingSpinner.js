/**
 * ZAIRE Healthcare — LoadingSpinner Component
 * Indicador de carga reutilizable con mensaje opcional.
 * @param {string} message - Mensaje opcional bajo el spinner
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors } from '../constants/colors';

const LoadingSpinner = ({ message = 'Cargando...', size = 'large' }) => (
    <View style={styles.container}>
        <ActivityIndicator size={size} color={colors.darkOliveGreen} />
        <Text style={styles.message}>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    message: {
        marginTop: 16,
        fontSize: 14,
        color: colors.darkGray,
    },
});

export default LoadingSpinner;
