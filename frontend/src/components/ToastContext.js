/**
 * ZAIRE Healthcare — ToastContext
 * Sistema de notificaciones toast elegante que reemplaza Alert.alert.
 * Uso: const { showToast } = useToast();
 *      showToast('Paciente guardado', 'success');
 *      showToast('Error al guardar', 'error');
 *      showToast('Seleccione al menos 2 síntomas', 'warning');
 *      showToast('Cargando...', 'info');
 */
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const ToastContext = createContext({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const TOAST_CONFIG = {
    success: {
        bg: colors.darkOliveGreen,
        icon: 'check-circle',
        label: 'Éxito',
    },
    error: {
        bg: '#C0392B',
        icon: 'alert-circle',
        label: 'Error',
    },
    warning: {
        bg: colors.fawn,
        icon: 'alert',
        label: 'Atención',
    },
    info: {
        bg: colors.kombuGreen,
        icon: 'information',
        label: 'Info',
    },
};

const Toast = ({ toast, onHide }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // Entrada
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 80, useNativeDriver: false }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
        ]).start();

        // Auto-hide
        const timer = setTimeout(() => hide(), toast.duration || 3500);
        return () => clearTimeout(timer);
    }, []);

    const hide = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: -100, duration: 250, useNativeDriver: false }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: false }),
        ]).start(() => onHide());
    };

    const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;

    return (
        <Animated.View style={[
            styles.toast,
            { backgroundColor: config.bg, transform: [{ translateY: slideAnim }], opacity: opacityAnim }
        ]}>
            {/* Burbuja decorativa */}
            <View style={styles.toastBubble} pointerEvents="none" />
            <MaterialCommunityIcons name={config.icon} size={22} color={colors.white} style={styles.toastIcon} />
            <View style={styles.toastBody}>
                <Text style={styles.toastLabel}>{config.label}</Text>
                <Text style={styles.toastMsg} numberOfLines={2}>{toast.message}</Text>
            </View>
            <TouchableOpacity onPress={hide} style={styles.toastClose}>
                <MaterialCommunityIcons name="close" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
        </Animated.View>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const hideToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={styles.container} pointerEvents="box-none">
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onHide={() => hideToast(toast.id)} />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        minWidth: 280,
        maxWidth: 400,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    toastBubble: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.08)',
        right: -20,
        top: -20,
    },
    toastIcon: {
        marginRight: 12,
    },
    toastBody: {
        flex: 1,
    },
    toastLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.75)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    toastMsg: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    toastClose: {
        padding: 4,
        marginLeft: 8,
    },
});

export default ToastContext;