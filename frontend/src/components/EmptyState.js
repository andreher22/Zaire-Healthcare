/**
 * ZAIRE Healthcare — EmptyState Component
 * Componente reutilizable para estados vacíos.
 * @param {string} icon - Nombre del icono
 * @param {string} title - Título del estado vacío
 * @param {string} message - Mensaje descriptivo
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const EmptyState = ({ icon = 'folder-open-outline', title = 'Sin datos', message = '' }) => (
    <View style={styles.container}>
        <MaterialCommunityIcons name={icon} size={64} color={colors.fawn} />
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.kombuGreen,
        marginTop: 16,
    },
    message: {
        fontSize: 14,
        color: colors.darkGray,
        textAlign: 'center',
        marginTop: 8,
    },
});

export default EmptyState;
