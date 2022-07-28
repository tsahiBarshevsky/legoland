import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

// App screens
import {
    AddressScreen,
    CartScreen,
    CheckoutScreen,
    HomeScreen,
    LoginScreen,
    OrdersScreen,
    PersonalDetailsScreen,
    ProductScreen,
    ProfileScreen,
    RegistrationScreen,
    SearchScreen,
    SplashScreen,
    WishListScreen,
} from '../../screens';

const options = { headerShown: false };

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
                    options={options}
                />
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Splash'
                    component={SplashScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Product'
                    component={ProductScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Cart'
                    component={CartScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Search'
                    component={SearchScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Checkout'
                    component={CheckoutScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Profile'
                    component={ProfileScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Address'
                    component={AddressScreen}
                    options={options}
                />
                <Stack.Screen
                    name='PersonalDetails'
                    component={PersonalDetailsScreen}
                    options={options}
                />
                <Stack.Screen
                    name='WishList'
                    component={WishListScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Orders'
                    component={OrdersScreen}
                    options={options}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;