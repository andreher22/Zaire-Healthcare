/**
 * ZAIRE Healthcare — LoginScreen
 * - Borde rojo + mensaje inline al error
 * - Hover con brillo en el botón
 * - Features del panel izquierdo con entrada escalonada
 * - Shake, pulse, fade-out, scale
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Animated,
    useWindowDimensions, TextInput as RNTextInput,
    ActivityIndicator, Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';

const FEATURES = [
    { icon: 'brain',           text: 'Diagnóstico con IA' },
    { icon: 'shield-lock',     text: 'Datos protegidos' },
    { icon: 'chart-arc',       text: 'Análisis en tiempo real' },
    { icon: 'clipboard-pulse', text: 'Historial clínico digital' },
];

const BgCircle = ({ style }) => <View style={[styles.bgCircle, style]} />;

// ─── Feature con animación de entrada escalonada ───
const FeatureItem = ({ icon, text, delay }) => {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1, duration: 400,
            delay, useNativeDriver: false,
        }).start();
    }, []);
    return (
        <Animated.View style={[styles.featureRow, {
            opacity: anim,
            transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
        }]}>
            <View style={styles.featureIcon}>
                <MaterialCommunityIcons name={icon} size={18} color={colors.cornsilk} />
            </View>
            <Text style={styles.featureText}>{text}</Text>
        </Animated.View>
    );
};

// ═══════════════════════════════════════
// PANEL IZQUIERDO
// ═══════════════════════════════════════
const BrandPanel = ({ fadeAnim, brandSlide, logoScale }) => (
    <Animated.View style={[styles.brandPanel, {
        opacity: fadeAnim,
        transform: [{ translateX: brandSlide }],
    }]}>
        <BgCircle style={styles.circle1} />
        <BgCircle style={styles.circle2} />
        <BgCircle style={styles.circle3} />

        <View style={styles.brandContent}>
            <Animated.View style={[styles.brandLogoBg, { transform: [{ scale: logoScale }] }]}>
                <Text style={{ fontSize: 56 }}>🏥</Text>
            </Animated.View>

            <Text style={styles.brandTitle}>ZAIRE</Text>
            <Text style={styles.brandSubtitle}>Healthcare</Text>
            <View style={styles.brandDivider} />
            <Text style={styles.brandDesc}>
                Sistema de Gestión Médica Inteligente con Diagnóstico Asistido por Inteligencia Artificial
            </Text>

            <View style={styles.brandFeatures}>
                {FEATURES.map((f, i) => (
                    <FeatureItem key={i} icon={f.icon} text={f.text} delay={600 + i * 150} />
                ))}
            </View>

            <Text style={styles.brandFooter}>© 2026 ZAIRE Healthcare · v1.0</Text>
        </View>
    </Animated.View>
);

// ═══════════════════════════════════════
// BOTÓN con hover
// ═══════════════════════════════════════
const LoginButton = ({ loading, onPress, scale }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                style={[styles.loginBtn, loading && styles.loginBtnDisabled, hovered && styles.loginBtnHover]}
                onPress={onPress}
                disabled={loading}
                activeOpacity={0.9}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
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
        </Animated.View>
    );
};

// ═══════════════════════════════════════
// FORMULARIO
// ═══════════════════════════════════════
const LoginForm = ({
    isDesktop, fadeAnim, slideAnim,
    titleAnim, field1Anim, field2Anim, btnAnim,
    email, setEmail, password, setPassword,
    secureText, setSecureText, focused, setFocused,
    loading, onLogin, btnScale,
    errorMsg, hasError,
}) => (
    <Animated.View style={[
        styles.formPanel,
        isDesktop && styles.formPanelDesktop,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
    ]}>
        <View style={[styles.formInner, isDesktop && styles.formInnerDesktop]}>

            {!isDesktop && (
                <Animated.View style={[styles.mobileLogo, { opacity: titleAnim }]}>
                    <View style={styles.mobileLogoBg}>
                        <Text style={{ fontSize: 44 }}>🏥</Text>
                    </View>
                    <Text style={styles.mobileTitle}>ZAIRE Healthcare</Text>
                    <Text style={styles.mobileSubtitle}>Gestión Médica Inteligente</Text>
                </Animated.View>
            )}

            {/* Título */}
            <Animated.View style={{
                opacity: titleAnim,
                transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            }}>
                <Text style={styles.formTitle}>{isDesktop ? 'Iniciar Sesión' : 'Bienvenido'}</Text>
                <Text style={styles.formSubtitle}>Ingresa tus credenciales para acceder al sistema</Text>
            </Animated.View>

            {/* Campo Email */}
            <Animated.View style={[styles.fieldGroup, {
                opacity: field1Anim,
                transform: [{ translateY: field1Anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }]}>
                <Text style={styles.fieldLabel}>Correo electrónico</Text>
                <View style={[
                    styles.inputWrap,
                    focused === 'email' && styles.inputWrapFocused,
                    hasError && styles.inputWrapError,
                ]}>
                    <MaterialCommunityIcons name="email-outline" size={20}
                        color={hasError ? colors.error : focused === 'email' ? colors.darkOliveGreen : colors.darkGray} />
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
            </Animated.View>

            {/* Campo Contraseña */}
            <Animated.View style={[styles.fieldGroup, {
                opacity: field2Anim,
                transform: [{ translateY: field2Anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }]}>
                <Text style={styles.fieldLabel}>Contraseña</Text>
                <View style={[
                    styles.inputWrap,
                    focused === 'password' && styles.inputWrapFocused,
                    hasError && styles.inputWrapError,
                ]}>
                    <MaterialCommunityIcons name="lock-outline" size={20}
                        color={hasError ? colors.error : focused === 'password' ? colors.darkOliveGreen : colors.darkGray} />
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
                            size={20} color={hasError ? colors.error : colors.darkGray}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Mensaje de error inline */}
            {hasError && (
                <Animated.View style={styles.errorBox}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.error} />
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </Animated.View>
            )}

            {/* Botón */}
            <Animated.View style={{ opacity: btnAnim }}>
                <LoginButton loading={loading} onPress={onLogin} scale={btnScale} />
            </Animated.View>

            <TouchableOpacity style={styles.forgotLink}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {!isDesktop && <Text style={styles.mobileFooter}>© 2026 ZAIRE Healthcare</Text>}
        </View>
    </Animated.View>
);

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
const LoginScreen = () => {
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [loading, setLoading]       = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [focused, setFocused]       = useState('');
    const [errorMsg, setErrorMsg]     = useState('');
    const [hasError, setHasError]     = useState(false);

    const { login } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const fadeAnim   = useRef(new Animated.Value(0)).current;
    const slideAnim  = useRef(new Animated.Value(40)).current;
    const brandSlide = useRef(new Animated.Value(-60)).current;
    const titleAnim  = useRef(new Animated.Value(0)).current;
    const field1Anim = useRef(new Animated.Value(0)).current;
    const field2Anim = useRef(new Animated.Value(0)).current;
    const btnAnim    = useRef(new Animated.Value(0)).current;
    const logoScale  = useRef(new Animated.Value(1)).current;
    const btnScale   = useRef(new Animated.Value(1)).current;
    const screenFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim,   { toValue: 1, duration: 600, useNativeDriver: false }),
            Animated.spring(slideAnim,  { toValue: 0, friction: 8,   useNativeDriver: false }),
            Animated.spring(brandSlide, { toValue: 0, friction: 8, delay: 150, useNativeDriver: false }),
        ]).start();

        Animated.stagger(120, [
            Animated.timing(titleAnim,  { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(field1Anim, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(field2Anim, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(btnAnim,    { toValue: 1, duration: 400, useNativeDriver: false }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, { toValue: 1.06, duration: 1800, useNativeDriver: false }),
                Animated.timing(logoScale, { toValue: 1.00, duration: 1800, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const clearError = () => { setHasError(false); setErrorMsg(''); };

    const handleLogin = async () => {
        if (!email || !password) {
            setHasError(true);
            setErrorMsg('Por favor ingresa tu correo y contraseña.');
            shakeForm();
            return;
        }
        clearError();
        setLoading(true);

        Animated.sequence([
            Animated.timing(btnScale, { toValue: 0.95, duration: 80, useNativeDriver: false }),
            Animated.timing(btnScale, { toValue: 1.00, duration: 80, useNativeDriver: false }),
        ]).start();

        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            setHasError(true);
            setErrorMsg('Correo o contraseña incorrectos. Intenta de nuevo.');
            shakeForm();
        } else {
            Animated.timing(screenFade, { toValue: 0, duration: 350, useNativeDriver: false }).start();
        }
    };

    const shakeForm = () => {
        Animated.sequence([
            Animated.timing(slideAnim, { toValue: -10, duration: 60, useNativeDriver: false }),
            Animated.timing(slideAnim, { toValue:  10, duration: 60, useNativeDriver: false }),
            Animated.timing(slideAnim, { toValue:  -6, duration: 60, useNativeDriver: false }),
            Animated.timing(slideAnim, { toValue:   0, duration: 60, useNativeDriver: false }),
        ]).start();
    };

    const formProps = {
        isDesktop, fadeAnim, slideAnim,
        titleAnim, field1Anim, field2Anim, btnAnim,
        email, setEmail: (v) => { setEmail(v); if (hasError) clearError(); },
        password, setPassword: (v) => { setPassword(v); if (hasError) clearError(); },
        secureText, setSecureText, focused, setFocused,
        loading, onLogin: handleLogin, btnScale,
        errorMsg, hasError,
    };

    return (
        <Animated.View style={[styles.screenWrap, { opacity: screenFade }]}>
            {isDesktop ? (
                <View style={styles.desktopContainer}>
                    <BrandPanel fadeAnim={fadeAnim} brandSlide={brandSlide} logoScale={logoScale} />
                    <LoginForm {...formProps} />
                </View>
            ) : (
                <View style={styles.mobileContainer}>
                    <LoginForm {...formProps} />
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    screenWrap: { flex: 1 },
    desktopContainer: {
        flex: 1, flexDirection: 'row',
        backgroundColor: colors.cornsilk,
    },
    mobileContainer: {
        flex: 1, backgroundColor: colors.cornsilk,
        justifyContent: 'center',
    },

    // Brand
    brandPanel: {
        flex: 1, backgroundColor: colors.kombuGreen,
        justifyContent: 'center', alignItems: 'center',
        padding: 40, overflow: 'hidden',
    },
    brandContent: { maxWidth: 380, alignItems: 'center', zIndex: 1 },
    brandLogoBg: {
        width: 100, height: 100, borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 24,
        shadowColor: colors.fawn,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3, shadowRadius: 20,
    },
    brandTitle: {
        fontSize: 42, fontWeight: '900',
        color: colors.cornsilk, letterSpacing: 6,
    },
    brandSubtitle: {
        fontSize: 18, color: colors.fawn,
        fontWeight: '500', marginTop: 2, letterSpacing: 3,
    },
    brandDivider: {
        width: 60, height: 3, backgroundColor: colors.fawn,
        borderRadius: 2, marginVertical: 24,
    },
    brandDesc: {
        fontSize: 15, color: 'rgba(254,250,224,0.75)',
        textAlign: 'center', lineHeight: 24,
    },
    brandFeatures: { marginTop: 36, width: '100%' },
    featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    featureIcon: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    featureText: { fontSize: 14, color: colors.cornsilk, fontWeight: '500' },
    brandFooter: { marginTop: 40, fontSize: 12, color: 'rgba(254,250,224,0.4)' },

    bgCircle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.04)' },
    circle1: { width: 300, height: 300, top: -80,   right: -80 },
    circle2: { width: 200, height: 200, bottom: 40,  left: -60 },
    circle3: { width: 120, height: 120, bottom: 180, right: 30, backgroundColor: 'rgba(255,255,255,0.06)' },

    // Form
    formPanel: { flex: 1, justifyContent: 'center', padding: 24 },
    formPanelDesktop: { padding: 60, maxWidth: 520 },
    formInner: { width: '100%' },
    formInnerDesktop: { maxWidth: 400 },

    mobileLogo: { alignItems: 'center', marginBottom: 36 },
    mobileLogoBg: {
        width: 80, height: 80, borderRadius: 24,
        backgroundColor: colors.darkOliveGreen + '12',
        justifyContent: 'center', alignItems: 'center', marginBottom: 14,
    },
    mobileTitle: { fontSize: 26, fontWeight: '800', color: colors.kombuGreen },
    mobileSubtitle: { fontSize: 14, color: colors.darkOliveGreen, marginTop: 4 },

    formTitle: { fontSize: 24, fontWeight: '800', color: colors.kombuGreen, marginBottom: 6 },
    formSubtitle: { fontSize: 14, color: colors.darkGray, marginBottom: 28, lineHeight: 20 },
    fieldGroup: { marginBottom: 18 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.kombuGreen, marginBottom: 8 },

    inputWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.white, borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'web' ? 14 : 12,
        borderWidth: 2, borderColor: colors.gray,
    },
    inputWrapFocused: {
        borderColor: colors.darkOliveGreen,
        backgroundColor: colors.darkOliveGreen + '04',
    },
    inputWrapError: {
        borderColor: '#E53935',
        backgroundColor: '#E5393508',
    },
    inputField: {
        flex: 1, fontSize: 15, color: colors.kombuGreen, marginLeft: 12,
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },

    // Error inline
    errorBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#E5393512',
        borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
        marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#E53935',
    },
    errorText: {
        fontSize: 13, color: '#E53935',
        fontWeight: '500', marginLeft: 8, flex: 1,
    },

    // Botón
    loginBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.darkOliveGreen,
        paddingVertical: 16, borderRadius: 14, marginTop: 8,
        elevation: 3,
        shadowColor: colors.darkOliveGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35, shadowRadius: 10,
    },
    loginBtnHover: {
        backgroundColor: colors.darkOliveGreen + 'DD',
        shadowOpacity: 0.5, shadowRadius: 16,
    },
    loginBtnDisabled: {
        backgroundColor: colors.darkGray + '60',
        elevation: 0, shadowOpacity: 0,
    },
    loginBtnText: { color: colors.white, fontSize: 16, fontWeight: '700', marginLeft: 10 },

    forgotLink: { alignItems: 'center', marginTop: 18 },
    forgotText: { color: colors.liver, fontSize: 13, fontWeight: '600' },
    mobileFooter: { textAlign: 'center', color: colors.darkGray + '60', fontSize: 12, marginTop: 40 },
});

export default LoginScreen;