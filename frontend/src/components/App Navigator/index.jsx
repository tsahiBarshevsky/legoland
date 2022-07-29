import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { CardStyleInterpolators } from '@react-navigation/stack';

// App screens
import {
    AddressScreen,
    CartScreen,
    CheckoutScreen,
    HomeScreen,
    LoginScreen,
    OrderScreen,
    OrdersScreen,
    PersonalDetailsScreen,
    ProductScreen,
    ProfileScreen,
    RegistrationScreen,
    SearchScreen,
    SplashScreen,
    WishListScreen,
} from '../../screens';

const Stack = createSharedElementStackNavigator();
const options = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
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
                    options={{
                        headerShown: false,
                        animationEnabled: false
                    }}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                        animationEnabled: false
                    }}
                />
                <Stack.Screen
                    name='Product'
                    component={ProductScreen}
                    options={{ headerShown: false }}
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
                <Stack.Screen
                    name='Order'
                    component={OrderScreen}
                    options={options}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;