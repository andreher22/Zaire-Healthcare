/**
 * ZAIRE Healthcare — StatsCard Component
 * Tarjeta reutilizable para mostrar estadísticas con icono.
 * @param {string} title - Título de la estadística
 * @param {string|number} value - Valor numérico
 * @param {string} icon - Nombre del icono de MaterialCommunityIcons
 * @param {string} color - Color de acento
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const StatsCard = ({ title, value, icon, color = colors.darkOliveGreen }) => (
    <Surface style={styles.card} elevation={2}>
        <View style={[styles.iconContainer, { backgroundColor: color + '18' }]}>
            <MaterialCommunityIcons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
    </Surface>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.white,
        marginHorizontal: 6,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    value: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.kombuGreen,
    },
    title: {
        fontSize: 12,
        color: colors.darkGray,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default StatsCard;
