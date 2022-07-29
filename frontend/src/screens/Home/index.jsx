import React, { useRef, useContext } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, Platform, StatusBar, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import MasonryList from '@react-native-seoul/masonry-list';
import { BottomSheet, FilterPanel, Filters, Header, ProductCard } from '../../components';
import { ThemeContext } from '../../utils/ThemeManager';
import { darkMode, lightMode } from '../../utils/themes';

const HomeScreen = () => {
    const { theme } = useContext(ThemeContext);
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const filterPanelRef = useRef(null);
    const bottomSheetRef = useRef(null);

    return (
        <>
            <ExpoStatusBar style={theme === 'Light' ? 'dark' : 'light'} />
            <View style={[styles.container, styles[`container${theme}`]]}>
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
    },
    containerLight: {
        backgroundColor: lightMode.background
    },
    containerDark: {
        backgroundColor: darkMode.background
    },
    contentContainerStyle: {
        marginBottom: 5,
        paddingHorizontal: 15,
        alignSelf: 'stretch'
    }
});