import React, { useContext } from 'react';
import { SafeAreaView, StatusBar, Platform, StyleSheet, View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { OrderCard } from '../../components';
import { ThemeContext } from '../../utils/ThemeManager';
import { darkMode, lightMode } from '../../utils/themes';

const OrdersScreen = () => {
    const { theme } = useContext(ThemeContext);
    const orders = useSelector(state => state.orders);

    return (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            <Text style={[styles.title, styles[`text${theme}`]]}>My Orders History</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.orderNumber}
                renderItem={({ item }) => {
                    return (
                        <View style={[styles.box, styles[`box${theme}`]]}>
                            <OrderCard order={item} />
                        </View>
                    )
                }}
                style={styles.flatList}
                contentContainerStyle={{ paddingBottom: 5 }}
            />
        </SafeAreaView>
    )
}

export default OrdersScreen;

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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 15
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    box: {
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginBottom: 15,
        elevation: 1
    },
    boxLight: {
        backgroundColor: lightMode.boxes
    },
    boxDark: {
        backgroundColor: darkMode.boxes
    },
    flatList: {
        paddingHorizontal: 15
    }
});