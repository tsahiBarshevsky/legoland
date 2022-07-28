import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { AntDesign, Feather, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../utils/ThemeManager';
import { OrderCard, ThemeSelector } from '../../components';
import { getIsUsinSystemScheme } from '../../utils/AsyncStorageHandler';
import { darkMode, lightMode } from '../../utils/themes';
import { authentication } from '../../utils/firebase';
import { signOut } from 'firebase/auth';

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
    const [touchAppearance, setTouchAppearance] = useState(false);
    const [touchSignout, setTouchSignout] = useState(false);
    const user = useSelector(state => state.user);
    const products = useSelector(state => state.products);
    const orders = useSelector(state => state.orders);
    const navigation = useNavigation();
    const themeSelectorRef = useRef();

    const onEditPersonalDetails = () => {
        navigation.navigate('PersonalDetails', {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            id: user._id
        });
    }

    const onSignOut = () => {
        signOut(authentication);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        })
    }

    useEffect(() => {
        getIsUsinSystemScheme().then((systemScheme) => setIsUsinSystemScheme(systemScheme));
    }, []);

    return (
        <>
            <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
                <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                    <Text style={[styles.title, styles[`text${theme}`]]}>My Profile</Text>
                    <View style={styles.subtitleWrapper}>
                        <AntDesign name="user" size={24} style={[styles.icon, styles[`icon${theme}`]]} />
                        <Text style={[styles.subtitle, styles[`text${theme}`]]}>My details</Text>
                    </View>
                    <View style={[styles.box, styles[`box${theme}`]]}>
                        <Text style={styles[`text${theme}`]}>{user.firstName} {user.lastName}</Text>
                        <Text style={styles[`text${theme}`]}>{user.email}</Text>
                        <Text style={styles[`text${theme}`]}>{user.phone}</Text>
                        <TouchableOpacity
                            onPress={onEditPersonalDetails}
                            style={styles.editButton}
                            activeOpacity={1}
                        >
                            <Text style={styles.textDark}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.subtitleWrapper}>
                        <Ionicons name="location-sharp" size={24} style={[styles.icon, styles[`icon${theme}`]]} />
                        <Text style={[styles.subtitle, styles[`text${theme}`]]}>My Addresses</Text>
                    </View>
                    <View style={[styles.box, styles[`box${theme}`]]}>
                        {Object.keys(user.addresses).length === 0 ?
                            <View>
                                <Text style={[styles[`text${theme}`], { marginBottom: 10 }]}>
                                    You haven't added addresses
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Address', { type: 'primary', user: user })}
                                    style={styles.editButton}
                                    activeOpacity={1}
                                >
                                    <Text style={styles.textDark}>Add primary address</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                                <Text style={[styles.address, styles[`text${theme}`]]}>Primary address</Text>
                                {user.addresses.primary &&
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={styles[`text${theme}`]}>{user.addresses.primary.street}, {user.addresses.primary.city}</Text>
                                        <Text style={styles[`text${theme}`]}>Apartment {user.addresses.primary.house}</Text>
                                        <Text style={styles[`text${theme}`]}>{user.addresses.primary.floor} Floor</Text>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Address', { type: 'primary', user: user })}
                                            style={styles.editButton}
                                            activeOpacity={1}
                                        >
                                            <Text style={styles.textDark}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                {user.addresses.secondary ?
                                    <View>
                                        <Text style={[styles.address, styles[`text${theme}`]]}>Secondary address</Text>
                                        <Text style={styles[`text${theme}`]}>{user.addresses.secondary.street}, {user.addresses.secondary.city}</Text>
                                        <Text style={styles[`text${theme}`]}>Apartment {user.addresses.secondary.house}</Text>
                                        <Text style={styles[`text${theme}`]}>{user.addresses.secondary.floor} Floor</Text>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Address', { type: 'secondary', user: user })}
                                            style={styles.editButton}
                                            activeOpacity={1}
                                        >
                                            <Text style={styles.textDark}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Address', { type: 'secondary', user: user })}
                                        style={styles.editButton}
                                        activeOpacity={1}
                                    >
                                        <Text style={styles.textDark}>Add secondary address</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        }
                    </View>
                    <View style={styles.subtitleWrapper}>
                        <Feather name="package" size={24} style={[styles.icon, styles[`icon${theme}`]]} />
                        <Text style={[styles.subtitle, styles[`text${theme}`]]}>My orders</Text>
                    </View>
                    {orders.length === 0 ?
                        <View style={[styles.box, styles[`box${theme}`]]}>
                            <Text style={[styles[`text${theme}`], { marginVertical: 5 }]}>
                                No orders history
                            </Text>
                        </View>
                        :
                        <View style={[styles.box, styles[`box${theme}`]]}>
                            {orders.slice(0, 2).map((order, index) => {
                                return (
                                    <View key={order.orderNumber}>
                                        <OrderCard order={order} />
                                        {orders.slice(0, 2).length - 1 !== index &&
                                            <View style={[styles.separator, styles[`separator${theme}`]]} />
                                        }
                                    </View>
                                )
                            })}
                            {orders.length > 2 &&
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Orders')}
                                    style={[styles.editButton, { marginTop: 10 }]}
                                    activeOpacity={1}
                                >
                                    <Text style={styles.textDark}>View All Orders</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    }
                    <View style={styles.subtitleWrapper}>
                        <Ionicons name="settings-outline" size={20} style={[styles.icon, styles[`icon${theme}`]]} />
                        <Text style={[styles.subtitle, styles[`text${theme}`]]}>Settings</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => themeSelectorRef.current?.open()}
                        onPressIn={() => setTouchAppearance(true)}
                        onPressOut={() => setTouchAppearance(false)}
                        style={[styles.settings, touchAppearance && styles[`touch${theme}`]]}
                        activeOpacity={1}
                    >
                        <View style={styles.wrapper}>
                            <View style={[styles.iconWrapper, styles.blue]}>
                                <MaterialCommunityIcons name="theme-light-dark" size={18} color="#80adce" />
                            </View>
                            <Text style={[styles.settingsTitle, styles[`text${theme}`]]}>
                                Appearance
                            </Text>
                        </View>
                        <View style={styles.wrapper}>
                            <Text style={styles.theme}>
                                {isUsinSystemScheme === 'true' ? 'System' : theme}
                            </Text>
                            <Entypo name="chevron-small-right" size={20} color="grey" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSignOut}
                        onPressIn={() => setTouchSignout(true)}
                        onPressOut={() => setTouchSignout(false)}
                        style={[styles.settings, touchSignout && styles[`touch${theme}`]]}
                        activeOpacity={1}
                    >
                        <View style={styles.wrapper}>
                            <View style={[styles.iconWrapper, styles.green]}>
                                <AntDesign name="logout" size={15} color="#47a559" />
                            </View>
                            <Text style={[styles.settingsTitle, styles[`text${theme}`]]}>
                                Sign Out
                            </Text>
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
        paddingBottom: 5
    },
    subtitleWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 15
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2
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
    icon: {
        marginRight: 5
    },
    iconLight: {
        color: lightMode.text
    },
    iconDark: {
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
    address: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    editButton: {
        backgroundColor: lightMode.primary,
        borderRadius: 25,
        paddingHorizontal: 24,
        paddingVertical: 5,
        alignSelf: 'flex-end',
        elevation: 1
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
        marginBottom: 5,
        paddingHorizontal: 15,
        paddingVertical: 5
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
    },
    touchLight: {
        backgroundColor: 'rgba(73, 69, 69, 0.1)'
    },
    touchDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    separator: {
        height: 1,
        width: '100%',
        borderRadius: 2,
        marginVertical: 10,
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
});