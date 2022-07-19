import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import Header from '../../components/Header';
import ProductCard from '../../components/Product Card';

const HomeScreen = () => {
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const navigation = useNavigation();

    const onSignOut = () => {
        signOut(authentication);
        navigation.replace('Login');
    }

    return (
        <View style={styles.container}>
            <Header cart={cart} />
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ProductCard product={item} />}
            />
            {/* <TouchableOpacity onPress={onSignOut}>
                <Text>Sign out</Text>
            </TouchableOpacity> */}
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