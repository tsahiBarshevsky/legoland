import React from 'react';
import { StyleSheet, Platform, StatusBar, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import MasonryList from '@react-native-seoul/masonry-list';
import { Filters, Header, ProductCard } from '../../components';

const HomeScreen = () => {
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);

    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <Header cart={cart} />
                <Filters />
                <MasonryList
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <ProductCard product={item} />}
                    contentContainerStyle={styles.contentContainerStyle}
                />
            </ScrollView>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        // paddingHorizontal: 15
    },
    contentContainerStyle: {
        // marginHorizontal: 15,
        marginBottom: 5
    }
});