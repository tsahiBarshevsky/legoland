import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { localhost } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';

const SplashScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        Promise.all([
            fetch(`http://${localhost}/get-user-cart?uid=${authentication.currentUser.uid}`),
            fetch(`http://${localhost}/get-all-products`),
            fetch(`http://${localhost}/get-user-info`),
        ])
            .then(([cart, products, user]) => Promise.all([cart.json(), products.json(), user.json()]))
            .then(([cart, products, user]) => {
                if (cart)
                    dispatch({ type: 'SET_CART', cart: cart });
                dispatch({ type: 'SET_PRODUCTS', products: products });
                dispatch({ type: 'SET_USER', user: user });
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