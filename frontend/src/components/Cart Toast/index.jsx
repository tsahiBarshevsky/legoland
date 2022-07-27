import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { lightMode, darkMode } from '../../utils/themes';

const CartToast = ({ props }) => {
    const { quantity, image, theme } = props;

    return (
        <View style={[styles.container, styles[`container${theme}`]]}>
            <Text style={[styles.text, styles[`text${theme}`]]}>
                {quantity === 1 ? 'Item has been added to cart' : `${quantity} Items has been added to cart`}
            </Text>
            <Image
                source={{ uri: image }}
                resizeMode='stretch'
                style={styles.image}
            />
        </View>
    )
}

export default CartToast;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        height: 45,
        paddingHorizontal: 10,
        borderRadius: 10,
        elevation: 2,
        borderWidth: 1
    },
    containerLight: {
        backgroundColor: lightMode.boxes,
        borderColor: 'rgba(255,255,255,0.15)'
    },
    containerDark: {
        backgroundColor: darkMode.boxes,
        borderColor: 'rgba(0,0,0,0.15)'
    },
    image: {
        height: 30,
        width: 33
    },
    text: {
        fontWeight: 'bold',
        flexShrink: 1,
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    }
});