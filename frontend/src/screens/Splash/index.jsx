import React, { useContext, useEffect } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { BallIndicator } from 'react-native-indicators';
import { localhost, sortByPrice } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';

const SplashScreen = () => {
    const { theme } = useContext(ThemeContext);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        Promise.all([
            fetch(`http://${localhost}/get-user-cart?uid=${authentication.currentUser.uid}`),
            fetch(`http://${localhost}/get-all-products`),
            fetch(`http://${localhost}/get-user-info?uid=${authentication.currentUser.uid}`),
            fetch(`http://${localhost}/get-user-orders?email=${authentication.currentUser.email}`),
            fetch(`http://${localhost}/get-user-wish-list?uid=${authentication.currentUser.uid}`),
        ])
            .then(([cart, products, user, orders, wishList]) => Promise.all([
                cart.json(),
                products.json(),
                user.json(),
                orders.json(),
                wishList.json()
            ]))
            .then(([cart, products, user, orders, wishList]) => {
                if (cart)
                    dispatch({ type: 'SET_CART', cart: cart });
                if (user)
                    dispatch({ type: 'SET_USER', user: user });
                if (wishList)
                    dispatch({ type: 'SET_WISH_LIST', wishList: wishList });
                dispatch({ type: 'SET_PRODUCTS', products: products.sort(sortByPrice) });
                dispatch({ type: 'SET_ORDERS', orders: orders });
            })
            .finally(() => navigation.replace('Home'));
    }, []);

    return (
        <>
            <ExpoStatusBar style={theme === 'Light' ? 'dark' : 'light'} />
            <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
                <BallIndicator size={30} count={8} color={theme === 'Light' ? 'black' : 'white'} />
            </SafeAreaView>
        </>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerLight: {
        backgroundColor: lightMode.background
    },
    containerDark: {
        backgroundColor: darkMode.background
    }
});