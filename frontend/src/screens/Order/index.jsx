import React, { useContext } from 'react';
import { StyleSheet, Platform, StatusBar, SafeAreaView, Text, View, ScrollView, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../utils/ThemeManager';
import { darkMode, lightMode } from '../../utils/themes';
import moment from 'moment';

const OrderScreen = ({ route }) => {
    const { order } = route.params;
    const { theme } = useContext(ThemeContext);
    const products = useSelector(state => state.products);

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    return (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            <ScrollView>
                <Text style={[styles.title, styles[`text${theme}`]]}>Order Details</Text>
                <View style={[styles.box, styles[`box${theme}`]]}>
                    <View style={[styles.detail, { marginBottom: 10 }]}>
                        <AntDesign name="user" size={17} style={[styles.icon, styles[`icon${theme}`]]} />
                        <View>
                            <Text style={styles[`text${theme}`]}>
                                {order.firstName} {order.lastName}
                            </Text>
                            <Text style={styles[`text${theme}`]}>{order.phone}</Text>
                        </View>
                    </View>
                    <View style={styles.detail}>
                        <Ionicons name="location-sharp" size={17} style={[styles.icon, styles[`icon${theme}`]]} />
                        <View>
                            <Text style={styles[`text${theme}`]}>{order.address.street}, {order.address.city}</Text>
                            <Text style={styles[`text${theme}`]}>Apartment {order.address.house}</Text>
                            <Text style={styles[`text${theme}`]}>{order.address.floor} Floor</Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.subtitle, styles[`text${theme}`]]}>Order Information</Text>
                <View style={[styles.box, styles[`box${theme}`]]}>
                    <Text style={styles.caption}>Order Number</Text>
                    <Text style={[styles[`text${theme}`], { marginBottom: 5 }]}>
                        {order.orderNumber}
                    </Text>
                    <Text style={styles.caption}>Order Time</Text>
                    <Text style={[styles[`text${theme}`], { marginBottom: 5 }]}>
                        {moment(order.date).format('DD/MM/YYYY HH:mm:ss')}
                    </Text>
                    <Text style={styles.caption}>Order Cost</Text>
                    <Text style={styles[`text${theme}`]}>{order.sum}₪</Text>
                </View>
                <Text style={[styles.subtitle, styles[`text${theme}`]]}>Products</Text>
                <View style={[styles.box, styles[`box${theme}`]]}>
                    <FlatList
                        data={order.products}
                        keyExtractor={(item) => item.catalogNumber}
                        scrollEnabled={false}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.product}>
                                    <View style={styles.imageWrapper}>
                                        <Image
                                            source={{ uri: getImageLink(item) }}
                                            resizeMode='stretch'
                                            style={styles.image}
                                        />
                                    </View>
                                    <View style={styles.wrapper}>
                                        <Text style={[styles.name, styles[`text${theme}`]]}>{item.name}</Text>
                                        <Text style={styles[`text${theme}`]}>#{item.catalogNumber}</Text>
                                        <Text style={styles[`text${theme}`]}>Quantity: {item.amount}</Text>
                                        <Text style={styles[`text${theme}`]}>Price: {item.sum}₪</Text>
                                    </View>
                                </View>
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ paddingVertical: 7 }} />}
                        contentContainerStyle={{ paddingVertical: 3 }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default OrderScreen;

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
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
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
        elevation: 1,
        marginHorizontal: 15
    },
    boxLight: {
        backgroundColor: lightMode.boxes
    },
    boxDark: {
        backgroundColor: darkMode.boxes
    },
    icon: {
        marginRight: 10
    },
    iconLight: {
        color: lightMode.text
    },
    iconDark: {
        color: darkMode.text
    },
    detail: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    product: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 100,
        marginRight: 8,
        borderRadius: 10,
        paddingVertical: 5,
        backgroundColor: 'rgba(207, 216, 220, 0.25)'
    },
    image: {
        flex: 1,
        height: undefined,
        width: '100%',
        aspectRatio: 1
    },
    wrapper: {
        flex: 1,
        height: '100%'
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 5,
        flexShrink: 1
    },
    caption: {
        color: '#7b7b7b'
    }
});