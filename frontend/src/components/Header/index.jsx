import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { authentication } from '../../utils/firebase';

const Header = ({ cart, bottomSheetRef }) => {
    const navigation = useNavigation();

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => bottomSheetRef.current?.open()}>
                    <Feather name="menu" size={24} color="black" />
                </TouchableOpacity>
                <Text>{authentication.currentUser.email}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Cart')}
                    style={styles.button}
                >
                    <Feather name="shopping-cart" size={24} color="black" />
                    {cart.products.length > 0 &&
                        <View style={styles.badge}>
                            <Text style={styles.caption}>{cart.products.length}</Text>
                        </View>
                    }
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 15
    },
    button: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        right: -7,
        top: -5,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderWidth: 2,
        borderColor: '#f5f5f5'
    },
    caption: {
        color: 'white',
        fontSize: 9
    }
});