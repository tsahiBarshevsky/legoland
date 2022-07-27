import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';
import { authentication } from '../../utils/firebase';
import { signOut } from 'firebase/auth';

const BottomSheet = ({ bottomSheetRef }) => {
    const { theme } = useContext(ThemeContext);
    const [touchProfile, setTouchProfile] = useState(false);
    const [touchWishlist, setTouchWishlist] = useState(false);
    const [touchSignout, setTouchSignout] = useState(false);
    const navigation = useNavigation();

    const onNavigate = (route) => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            navigation.navigate(route);
        }, 500);
    }

    const onSignOut = () => {
        bottomSheetRef.current?.close();
        // setTimeout(() => {
        //     signOut(authentication);
        //     navigation.replace('Login');
        // }, 500);
    }

    return (
        <Modalize
            ref={bottomSheetRef}
            threshold={50}
            adjustToContentHeight
            handlePosition='inside'
            modalStyle={[styles.modalStyle, styles[`modalBackground${theme}`]]}
            handleStyle={[styles[`handleStyle${theme}`]]}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
        >
            <View style={styles.bottomSheetContainer}>
                <TouchableOpacity
                    onPress={() => onNavigate('Profile')}
                    onPressIn={() => setTouchProfile(true)}
                    onPressOut={() => setTouchProfile(false)}
                    style={[styles.button, touchProfile && styles[`touch${theme}`]]}
                    activeOpacity={1}
                >
                    <View style={[styles.iconWrapper, styles.blue]}>
                        <AntDesign name="user" size={20} color="#80adce" />
                    </View>
                    <Text style={[styles.title, styles[`title${theme}`]]}>My Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onNavigate('WishList')}
                    onPressIn={() => setTouchWishlist(true)}
                    onPressOut={() => setTouchWishlist(false)}
                    style={[styles.button, touchWishlist && styles[`touch${theme}`]]}
                    activeOpacity={1}
                >
                    <View style={[styles.iconWrapper, styles.red]}>
                        <AntDesign name="hearto" size={18} color="#ca6063" />
                    </View>
                    <Text style={[styles.title, styles[`title${theme}`]]}>My Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onSignOut}
                    onPressIn={() => setTouchSignout(true)}
                    onPressOut={() => setTouchSignout(false)}
                    style={[styles.button, touchSignout && styles[`touch${theme}`]]}
                    activeOpacity={1}
                >
                    <View style={[styles.iconWrapper, styles.green]}>
                        <AntDesign name="logout" size={18} color="#47a559" />
                    </View>
                    <Text style={[styles.title, styles[`title${theme}`]]}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </Modalize>
    )
}

export default BottomSheet;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingTop: 25,
        paddingBottom: 10
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalBackgroundLight: {
        backgroundColor: lightMode.background
    },
    modalBackgroundDark: {
        backgroundColor: darkMode.background
    },
    handleStyleLight: {
        backgroundColor: 'lightgrey'
    },
    handleStyleDark: {
        backgroundColor: darkMode.boxes
    },
    touchLight: {
        backgroundColor: 'rgba(73, 69, 69, 0.1)'
    },
    touchDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    iconWrapper: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35 / 2,
        marginRight: 10
    },
    blue: {
        backgroundColor: '#dbecf5'
    },
    green: {
        backgroundColor: '#dff0dd'
    },
    red: {
        backgroundColor: '#fddfe0'
    },
    title: {
        fontWeight: 'bold',
        transform: [{ translateY: -1.5 }]
    },
    titleLight: {
        color: lightMode.text
    },
    titleDark: {
        color: darkMode.text
    }
});