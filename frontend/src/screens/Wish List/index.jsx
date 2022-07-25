import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import MasonryList from '@react-native-seoul/masonry-list';
import { ProductCard } from '../../components';

const WishListScreen = () => {
    const wishList = useSelector(state => state.wishList);

    return (
        <View style={styles.container}>
            <ScrollView>
                {wishList.products.length > 0 ?
                    <>
                        <Text>Wish list</Text>
                        <MasonryList
                            data={wishList.products}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item, i }) => {
                                return (
                                    <ProductCard
                                        product={item}
                                        index={i}
                                    />
                                )
                            }}
                            contentContainerStyle={styles.contentContainerStyle}
                            style={{ alignSelf: 'stretch' }}
                        />
                    </>
                    :
                    <Text>Wish list is empty</Text>
                }
            </ScrollView>
        </View>
    )
}

export default WishListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        // paddingHorizontal: 15
    },
    contentContainerStyle: {
        // marginHorizontal: 15,
        marginBottom: 5,
        paddingHorizontal: 15,
        alignSelf: 'stretch'
    }
});