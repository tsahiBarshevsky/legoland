import React, { useRef } from 'react';
import { StyleSheet, Platform, StatusBar, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import MasonryList from '@react-native-seoul/masonry-list';
import { BottomSheet, FilterPanel, Filters, Header, ProductCard } from '../../components';

const HomeScreen = () => {
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const filterPanelRef = useRef(null);
    const bottomSheetRef = useRef(null);

    return (
        <>
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Header
                        cart={cart}
                        bottomSheetRef={bottomSheetRef}
                    />
                    <Filters filterPanelRef={filterPanelRef} />
                    <MasonryList
                        data={products}
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
                </ScrollView>
            </View>
            <BottomSheet bottomSheetRef={bottomSheetRef} />
            <FilterPanel filterPanelRef={filterPanelRef} />
        </>
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
        marginBottom: 5,
        paddingHorizontal: 15,
        alignSelf: 'stretch'
    }
});