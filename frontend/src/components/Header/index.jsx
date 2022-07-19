import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Header = ({ cart }) => {
    return (
        <View style={styles.container}>
            <Feather name="menu" size={24} color="black" />
            <TouchableOpacity style={styles.button}>
                <Feather name="shopping-cart" size={24} color="black" />
                {cart.products.length > 0 &&
                    <View style={styles.badge}>
                        <Text style={styles.caption}>{cart.products.length}</Text>
                    </View>
                }
            </TouchableOpacity>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10
    },
    button: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        right: -4,
        width: 14,
        height: 14,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderWidth: 2,
        borderColor: '#f5f5f5'
    },
    caption: {
        color: 'white',
        fontSize: 7
    }
});