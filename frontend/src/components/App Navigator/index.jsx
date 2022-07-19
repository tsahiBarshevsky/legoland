import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

// App screens
import {
    CartScreen,
    HomeScreen,
    LoginScreen,
    ProductScreen,
    RegistrationScreen,
    SplashScreen,
} from '../../screens';

const Stack = createSharedElementStackNavigator();
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#f5f5f5'
    }
}

const AppNavigator = () => {
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen
                    name='Registration'
                    component={RegistrationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Splash'
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Product'
                    component={ProductScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Cart'
                    component={CartScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;