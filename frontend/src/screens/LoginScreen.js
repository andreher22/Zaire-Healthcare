import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa correo y contraseña');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Error de inicio de sesión', result.error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Placeholder para logo */}
                <Surface style={styles.logoPlaceholder} elevation={4}>
                    <Text variant="displayLarge" style={{ fontSize: 50 }}>🏥</Text>
                </Surface>
                <Text variant="headlineMedium" style={styles.title}>ZAIRE Healthcare</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>Gestión Médica Inteligente</Text>
            </View>

            <Surface style={styles.formContainer} elevation={2}>
                <TextInput
                    label="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    outlineColor={colors.fawn}
                    activeOutlineColor={colors.darkOliveGreen}
                    left={<TextInput.Icon icon="email" color={colors.darkOliveGreen} />}
                />

                <TextInput
                    label="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry={secureText}
                    style={styles.input}
                    outlineColor={colors.fawn}
                    activeOutlineColor={colors.darkOliveGreen}
                    left={<TextInput.Icon icon="lock" color={colors.darkOliveGreen} />}
                    right={
                        <TextInput.Icon
                            icon={secureText ? "eye" : "eye-off"}
                            onPress={() => setSecureText(!secureText)}
                        />
                    }
                />

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    buttonColor={colors.darkOliveGreen}
                >
                    Iniciar Sesión
                </Button>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text variant="bodyMedium" style={{ color: colors.liver }}>
                        ¿Olvidaste tu contraseña?
                    </Text>
                </TouchableOpacity>
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cornsilk,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: colors.kombuGreen,
        fontWeight: 'bold',
    },
    subtitle: {
        color: colors.darkOliveGreen,
        marginTop: 5,
    },
    formContainer: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 15,
    },
    input: {
        marginBottom: 15,
        backgroundColor: colors.white,
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    forgotPassword: {
        marginTop: 15,
        alignItems: 'center',
    },
});

export default LoginScreen;
