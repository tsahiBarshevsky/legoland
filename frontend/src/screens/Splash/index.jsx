import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { localhost, sortByPrice } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';

const SplashScreen = () => {
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
                dispatch({ type: 'SET_PRODUCTS', products: products.sort(sortByPrice) });
                dispatch({ type: 'SET_USER', user: user });
                dispatch({ type: 'SET_ORDERS', orders: orders });
                dispatch({ type: 'SET_WISH_LIST', wishList: wishList });
            })
            .finally(() => navigation.replace('Home'));
    }, []);

    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center'
    }
});