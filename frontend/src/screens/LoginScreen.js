/**
 * ZAIRE Healthcare — LoginScreen
 * Diseño premium split-screen para laptop, centrado elegante en móvil.
 * Incluye animaciones, glassmorphism y branding visual.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    useWindowDimensions,
    TextInput as RNTextInput,
    ActivityIndicator,
    Platform,
    Alert,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [focused, setFocused] = useState('');

    const { login } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    // Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const brandSlide = useRef(new Animated.Value(-60)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: false }),
            Animated.spring(brandSlide, { toValue: 0, friction: 8, delay: 200, useNativeDriver: false }),
        ]).start();
    }, []);

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

    // ═══════════════════════════════════════
    // PANEL IZQUIERDO — Branding (solo desktop)
    // ═══════════════════════════════════════
    const BrandPanel = () => (
        <Animated.View
            style={[
                styles.brandPanel,
                { opacity: fadeAnim, transform: [{ translateX: brandSlide }] },
            ]}
        >
            <View style={styles.brandContent}>
                {/* Logo grande */}
                <View style={styles.brandLogoWrap}>
                    <View style={styles.brandLogoBg}>
                        <Text style={{ fontSize: 56 }}>🏥</Text>
                    </View>
                </View>
                <Text style={styles.brandTitle}>ZAIRE</Text>
                <Text style={styles.brandSubtitle}>Healthcare</Text>
                <View style={styles.brandDivider} />
                <Text style={styles.brandDesc}>
                    Sistema de Gestión Médica Inteligente con Diagnóstico Asistido por Inteligencia Artificial
                </Text>

                {/* Features */}
                <View style={styles.brandFeatures}>
                    {[
                        { icon: 'brain', text: 'Diagnóstico con IA' },
                        { icon: 'shield-lock', text: 'Datos protegidos' },
                        { icon: 'chart-arc', text: 'Análisis en tiempo real' },
                        { icon: 'clipboard-pulse', text: 'Historial clínico digital' },
                    ].map((f, i) => (
                        <View key={i} style={styles.featureRow}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name={f.icon} size={18} color={colors.cornsilk} />
                            </View>
                            <Text style={styles.featureText}>{f.text}</Text>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <Text style={styles.brandFooter}>
                    © 2026 ZAIRE Healthcare · v1.0
                </Text>
            </View>
        </Animated.View>
    );

    // ═══════════════════════════════════════
    // FORMULARIO DE LOGIN
    // ═══════════════════════════════════════
    const LoginForm = () => (
        <Animated.View
            style={[
                styles.formPanel,
                isDesktop && styles.formPanelDesktop,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={[styles.formInner, isDesktop && styles.formInnerDesktop]}>
                {/* Logo para móvil */}
                {!isDesktop && (
                    <View style={styles.mobileLogo}>
                        <View style={styles.mobileLogoBg}>
                            <Text style={{ fontSize: 44 }}>🏥</Text>
                        </View>
                        <Text style={styles.mobileTitle}>ZAIRE Healthcare</Text>
                        <Text style={styles.mobileSubtitle}>Gestión Médica Inteligente</Text>
                    </View>
                )}

                {/* Header del form */}
                <Text style={styles.formTitle}>
                    {isDesktop ? 'Iniciar Sesión' : 'Bienvenido'}
                </Text>
                <Text style={styles.formSubtitle}>
                    Ingresa tus credenciales para acceder al sistema
                </Text>

                {/* Campo Email */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Correo electrónico</Text>
                    <View style={[
                        styles.inputWrap,
                        focused === 'email' && styles.inputWrapFocused,
                    ]}>
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={20}
                            color={focused === 'email' ? colors.darkOliveGreen : colors.darkGray}
                        />
                        <RNTextInput
                            placeholder="doctor@zaire.com"
                            placeholderTextColor={colors.darkGray + '80'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.inputField}
                            onFocus={() => setFocused('email')}
                            onBlur={() => setFocused('')}
                        />
                    </View>
                </View>

                {/* Campo Contraseña */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Contraseña</Text>
                    <View style={[
                        styles.inputWrap,
                        focused === 'password' && styles.inputWrapFocused,
                    ]}>
                        <MaterialCommunityIcons
                            name="lock-outline"
                            size={20}
                            color={focused === 'password' ? colors.darkOliveGreen : colors.darkGray}
                        />
                        <RNTextInput
                            placeholder="••••••••"
                            placeholderTextColor={colors.darkGray + '80'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={secureText}
                            style={styles.inputField}
                            onFocus={() => setFocused('password')}
                            onBlur={() => setFocused('')}
                        />
                        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                            <MaterialCommunityIcons
                                name={secureText ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color={colors.darkGray}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botón Login */}
                <TouchableOpacity
                    style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="login" size={20} color={colors.white} />
                            <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Link olvidar contraseña */}
                <TouchableOpacity style={styles.forgotLink}>
                    <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* Nota al pie */}
                {!isDesktop && (
                    <Text style={styles.mobileFooter}>© 2026 ZAIRE Healthcare</Text>
                )}
            </View>
        </Animated.View>
    );

    // ═══════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════
    if (isDesktop) {
        return (
            <View style={styles.desktopContainer}>
                <BrandPanel />
                <LoginForm />
            </View>
        );
    }

    return (
        <View style={styles.mobileContainer}>
            <LoginForm />
        </View>
    );
};

// ═══════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════
const styles = StyleSheet.create({
    // Desktop layout
    desktopContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.cornsilk,
    },

    // Mobile layout
    mobileContainer: {
        flex: 1,
        backgroundColor: colors.cornsilk,
        justifyContent: 'center',
    },

    // ─── Brand Panel (izquierda desktop) ───
    brandPanel: {
        flex: 1,
        backgroundColor: colors.kombuGreen,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    brandContent: {
        maxWidth: 380,
        alignItems: 'center',
    },
    brandLogoWrap: {
        marginBottom: 24,
    },
    brandLogoBg: {
        width: 100,
        height: 100,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: colors.cornsilk,
        letterSpacing: 6,
    },
    brandSubtitle: {
        fontSize: 18,
        color: colors.fawn,
        fontWeight: '500',
        marginTop: 2,
        letterSpacing: 3,
    },
    brandDivider: {
        width: 60,
        height: 3,
        backgroundColor: colors.fawn,
        borderRadius: 2,
        marginVertical: 24,
    },
    brandDesc: {
        fontSize: 15,
        color: 'rgba(254,250,224,0.75)',
        textAlign: 'center',
        lineHeight: 24,
    },
    brandFeatures: {
        marginTop: 36,
        width: '100%',
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    featureIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    featureText: {
        fontSize: 14,
        color: colors.cornsilk,
        fontWeight: '500',
    },
    brandFooter: {
        marginTop: 40,
        fontSize: 12,
        color: 'rgba(254,250,224,0.4)',
    },

    // ─── Form Panel (derecha desktop / full móvil) ───
    formPanel: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    formPanelDesktop: {
        padding: 60,
        maxWidth: 520,
    },
    formInner: {
        width: '100%',
    },
    formInnerDesktop: {
        maxWidth: 400,
    },

    // Mobile branding
    mobileLogo: {
        alignItems: 'center',
        marginBottom: 36,
    },
    mobileLogoBg: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: colors.darkOliveGreen + '12',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    mobileTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.kombuGreen,
    },
    mobileSubtitle: {
        fontSize: 14,
        color: colors.darkOliveGreen,
        marginTop: 4,
    },

    // Form fields
    formTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.kombuGreen,
        marginBottom: 6,
    },
    formSubtitle: {
        fontSize: 14,
        color: colors.darkGray,
        marginBottom: 28,
        lineHeight: 20,
    },
    fieldGroup: {
        marginBottom: 18,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.kombuGreen,
        marginBottom: 8,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'web' ? 14 : 12,
        borderWidth: 2,
        borderColor: colors.gray,
    },
    inputWrapFocused: {
        borderColor: colors.darkOliveGreen,
        backgroundColor: colors.darkOliveGreen + '04',
    },
    inputField: {
        flex: 1,
        fontSize: 15,
        color: colors.kombuGreen,
        marginLeft: 12,
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },

    // Login button
    loginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkOliveGreen,
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 8,
        elevation: 3,
        shadowColor: colors.darkOliveGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    loginBtnDisabled: {
        backgroundColor: colors.darkGray + '60',
        elevation: 0,
        shadowOpacity: 0,
    },
    loginBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },

    // Footer
    forgotLink: {
        alignItems: 'center',
        marginTop: 18,
    },
    forgotText: {
        color: colors.liver,
        fontSize: 13,
        fontWeight: '600',
    },
    mobileFooter: {
        textAlign: 'center',
        color: colors.darkGray + '60',
        fontSize: 12,
        marginTop: 40,
    },
});

export default LoginScreen;
