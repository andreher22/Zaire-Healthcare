import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { useAuth } from '../context/AuthContext';
import { theme } from '../constants/colors';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Pantalla de carga (splash)
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <Stack.Screen name="Main" component={MainNavigator} />
                    ) : (
                        <Stack.Screen name="Auth" component={AuthNavigator} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};

export default AppNavigator;
