import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const HomeScreen = () => {
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const navigation = useNavigation();

    console.log('cart', cart)

    const onSignOut = () => {
        signOut(authentication);
        navigation.replace('Login');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onSignOut}>
                <Text>Sign out</Text>
            </TouchableOpacity>
            {/* <Text>=====cart======</Text>
            <Text>products in cart: {cart.products.length}</Text>
            <Text>{cart.sum}₪</Text> */}
            <Text>=====products======</Text>
            {products.map((product) => {
                return (
                    <View key={product._id} style={{ marginBottom: 10 }}>
                        <Text>{product.name}</Text>
                        <Text>{product.description}</Text>
                    </View>
                )
            })}
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    }
});