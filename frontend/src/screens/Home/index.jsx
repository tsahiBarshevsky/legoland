import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import Filters from '../../components/Filters';
import Header from '../../components/Header';
import ProductCard from '../../components/Product Card';

const HomeScreen = () => {
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);

    return (
        <View style={styles.container}>
            <Header cart={cart} />
            <Filters />
            {/* <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ProductCard product={item} />}
                ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }} />}
            /> */}
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