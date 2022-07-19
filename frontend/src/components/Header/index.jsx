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
        backgroundColor: 'lightblue',
        marginVertical: 10
    },
    button: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        right: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    caption: {
        color: 'white',
        fontSize: 7,
        fontWeight: 'bold'
    }
});