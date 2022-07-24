import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { dummyOrders } from '../../utils/utilities';

const ProfileScreen = () => {
    const user = useSelector(state => state.user);
    const products = useSelector(state => state.products);
    const navigation = useNavigation();

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    const Separator = () => (
        <View style={styles.separator} />
    )

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.titleWrapper}>
                    <Ionicons name="location-sharp" size={24} color="black" />
                    <Text style={styles.title}>Address Book</Text>
                </View>
                <View style={styles.box}>
                    {Object.keys(user.addresses).length === 0 ?
                        <View>
                            <Text>There's no addresses</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Address', { type: 'primary', user: user })}>
                                <Text>Add primary address</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            <Text>Primary address</Text>
                            {user.addresses.primary &&
                                <View style={{ marginBottom: 10 }}>
                                    <Text>{user.addresses.primary.street}, {user.addresses.primary.city}</Text>
                                    <Text>Apartment {user.addresses.primary.house}</Text>
                                    <Text>{user.addresses.primary.floor} Floor</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Address', { type: 'primary', user: user })}>
                                        <Text>Edit address</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {user.addresses.secondary ?
                                <View>
                                    <Text>Secondary address</Text>
                                    <Text>{user.addresses.secondary.street}, {user.addresses.secondary.city}</Text>
                                    <Text>Apartment {user.addresses.secondary.house}</Text>
                                    <Text>{user.addresses.secondary.floor} Floor</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Address', { type: 'secondary', user: user })}>
                                        <Text>Edit address</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity onPress={() => navigation.navigate('Address', { type: 'secondary', user: user })}>
                                    <Text>Add secondary address</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </View>
                <View style={styles.titleWrapper}>
                    <Feather name="package" size={24} color="black" />
                    <Text style={styles.title}>Orders</Text>
                </View>
                {/* <View style={styles.box}>
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
                </View> */}
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
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    box: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginBottom: 15
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