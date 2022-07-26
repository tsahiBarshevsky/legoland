import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { AntDesign, Feather, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../utils/ThemeManager';
import { ThemeSelector } from '../../components';
import { getIsUsinSystemScheme } from '../../utils/AsyncStorageHandler';
import { darkMode, lightMode } from '../../utils/themes';

// React Native Components
import {
    StyleSheet,
    Platform,
    StatusBar,
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';

const ProfileScreen = () => {
    const { theme } = useContext(ThemeContext);
    const [isUsinSystemScheme, setIsUsinSystemScheme] = useState('false');
    const user = useSelector(state => state.user);
    const products = useSelector(state => state.products);
    const orders = useSelector(state => state.orders);
    const navigation = useNavigation();
    const themeSelectorRef = useRef();

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    const onEditPersonalDetails = () => {
        navigation.navigate('PersonalDetails', {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            id: user._id
        });
    }

    const Separator = () => (
        <View style={styles.separator} />
    )

    useEffect(() => {
        getIsUsinSystemScheme().then((systemScheme) => setIsUsinSystemScheme(systemScheme));
    }, []);

    return (
        <>
            <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
                <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                    <View style={styles.titleWrapper}>
                        <AntDesign name="user" size={24} color="black" style={styles.icon} />
                        <Text style={styles.title}>My details</Text>
                    </View>
                    <View style={styles.box}>
                        <Text>{user.firstName} {user.lastName}</Text>
                        <Text>{user.email}</Text>
                        <Text>{user.phone}</Text>
                        <TouchableOpacity onPress={onEditPersonalDetails}>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleWrapper}>
                        <Ionicons name="location-sharp" size={24} color="black" style={styles.icon} />
                        <Text style={styles.title}>My Addresses</Text>
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
                        <Feather name="package" size={24} color="black" style={styles.icon} />
                        <Text style={styles.title}>My orders</Text>
                    </View>
                    <View style={styles.box}>
                        <FlatList
                            data={orders.length < 2 ? orders : orders.slice(0, 2)}
                            keyExtractor={(item) => item.orderNumber}
                            scrollEnabled={false}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <Text>#{item.orderNumber}</Text>
                                        <Text>{moment(item.date).format('DD/MM/YY HH:mm')}</Text>
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
                        {orders.length > 2 &&
                            <TouchableOpacity style={styles.button}>
                                <Text>See all orders</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.titleWrapper}>
                        <Ionicons name="settings-outline" size={20} color="black" style={styles.icon} />
                        <Text style={styles.title}>Settings</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => themeSelectorRef.current?.open()}
                        style={styles.settings}
                        activeOpacity={1}
                    >
                        <View style={styles.wrapper}>
                            <View style={[styles.iconWrapper, styles.blue]}>
                                <MaterialCommunityIcons name="theme-light-dark" size={18} color="#80adce" />
                            </View>
                            <Text style={styles.settingsTitle}>Appearance</Text>
                        </View>
                        <View style={styles.wrapper}>
                            <Text style={styles.theme}>{theme}</Text>
                            <Entypo name="chevron-small-right" size={20} color="grey" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => console.log('open modal')}
                        style={styles.settings}
                        activeOpacity={1}
                    >
                        <View style={styles.wrapper}>
                            <View style={[styles.iconWrapper, styles.green]}>
                                <AntDesign name="logout" size={15} color="#47a559" />
                            </View>
                            <Text style={styles.settingsTitle}>Logout</Text>
                        </View>
                        <View style={styles.wrapper}>
                            <Entypo name="chevron-small-right" size={20} color="grey" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
            <ThemeSelector
                themeSelectorRef={themeSelectorRef}
                isUsinSystemScheme={isUsinSystemScheme}
                setIsUsinSystemScheme={setIsUsinSystemScheme}
            />
        </>
    )
}

export default ProfileScreen;

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
        paddingHorizontal: 15,
        paddingBottom: 5
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5
    },
    icon: {
        marginRight: 5
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2
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
    },
    settings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    settingsTitle: {
        fontWeight: 'bold',
        transform: [{ translateY: -1.5 }]
    },
    iconWrapper: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginRight: 10
    },
    blue: {
        backgroundColor: '#dbecf5'
    },
    green: {
        backgroundColor: '#dff0dd'
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    theme: {
        color: 'grey',
        transform: [{ translateY: -1.5 }],
        marginRight: 5
    }
});