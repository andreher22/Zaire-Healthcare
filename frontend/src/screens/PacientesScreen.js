import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, ActivityIndicator, Card, Avatar, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../constants/colors';
import PacientesService from '../services/PacientesService';

const PacientesScreen = ({ navigation }) => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadPacientes = async () => {
        try {
            const params = {};
            if (searchQuery) {
                params.search = searchQuery;
            }

            const data = await PacientesService.getPacientes(params);
            setPacientes(data.results || []);
        } catch (error) {
            console.error('Error cargando pacientes:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Cargar al enfocar la pantalla
    useFocusEffect(
        useCallback(() => {
            loadPacientes();
        }, [searchQuery])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadPacientes();
    };

    const getInitials = (name) => {
        return name
            ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
            : 'PAC';
    };

    const renderItem = ({ item }) => (
        <Card
            style={styles.card}
            onPress={() => navigation.navigate('DetallePaciente', { pacienteId: item.id })}
            mode="elevated"
        >
            <Card.Title
                title={item.nombre}
                subtitle={`${item.edad} años • ${item.sexo === 'M' ? 'Masculino' : item.sexo === 'F' ? 'Femenino' : 'Otro'}`}
                left={(props) => (
                    <Avatar.Text
                        {...props}
                        label={getInitials(item.nombre)}
                        style={{ backgroundColor: colors.darkOliveGreen }}
                        color={colors.white}
                    />
                )}
                right={(props) => (
                    <IconButton {...props} icon="chevron-right" onPress={() => navigation.navigate('DetallePaciente', { pacienteId: item.id })} />
                )}
            />
            <Card.Content>
                <Text variant="bodyMedium" style={{ color: colors.darkGray }}>
                    📞 {item.contacto || 'Sin contacto'}
                </Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.title}>Mis Pacientes</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>Gestión y seguimiento</Text>
            </View>

            <Searchbar
                placeholder="Buscar por nombre..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
                iconColor={colors.darkOliveGreen}
                inputStyle={{ color: colors.kombuGreen }}
                elevation={1}
            />

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color={colors.darkOliveGreen} style={styles.loader} />
            ) : (
                <FlatList
                    data={pacientes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.darkOliveGreen]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text variant="bodyLarge" style={{ color: colors.darkGray }}>No se encontraron pacientes.</Text>
                        </View>
                    }
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                color={colors.white}
                onPress={() => navigation.navigate('NuevoPaciente')}
                label="Nuevo"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        color: colors.kombuGreen,
        fontWeight: 'bold',
    },
    subtitle: {
        color: colors.darkOliveGreen,
    },
    searchbar: {
        margin: 15,
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    list: {
        padding: 15,
        paddingTop: 0,
        paddingBottom: 80, // Espacio para el FAB
    },
    card: {
        marginBottom: 10,
        backgroundColor: colors.white,
    },
    loader: {
        marginTop: 50,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colors.darkOliveGreen,
    },
});

export default PacientesScreen;
