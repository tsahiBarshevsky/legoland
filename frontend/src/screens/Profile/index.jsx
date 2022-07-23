import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { dummyOrders } from '../../utils/utilities';

const ProfileScreen = () => {
    const products = useSelector(state => state.products);

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    const Separator = () => (
        <View style={styles.separator} />
    )

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Account</Text>
                <Text style={styles.title}>Orders</Text>
                <View style={styles.box}>
                    <FlatList
                        data={dummyOrders.length < 2 ? dummyOrders : dummyOrders.slice(0, 2)}
                        keyExtractor={(item) => item.orderNumber}
                        scrollEnabled={false}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Text>#{item.orderNumber}</Text>
                                    <Text>{moment(item.date).format('DD/MM/YY')}</Text>
                                    <Text>{item.sum}₪</Text>
                                    <FlatList
                                        data={item.products}
                                        horizontal
                                        scrollEnabled={false}
                                        keyExtractor={(item) => item.catalogNumber}
                                        renderItem={({ item }) => {
                                            return (
                                                <Image
                                                    source={{ uri: getImageLink(item) }}
                                                    resizeMode='center'
                                                    style={{ width: 40, height: 40 }}
                                                />
                                            )
                                        }}
                                        ItemSeparatorComponent={() => <View style={{ marginHorizontal: 5 }} />}
                                    />
                                </View>
                            )
                        }}
                        ItemSeparatorComponent={Separator}
                    />
                    {dummyOrders.length > 2 &&
                        <TouchableOpacity style={styles.button}>
                            <Text>See all orders</Text>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    box: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5
    },
    button: {
        alignSelf: 'flex-end',
        marginTop: 10
    }
});