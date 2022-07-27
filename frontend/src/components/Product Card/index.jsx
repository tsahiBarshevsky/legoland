import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';

const ProductCard = ({ product, index }) => {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Product', { product })}
            style={[styles.card, styles[`card${theme}`], index % 2 === 0 ? { marginRight: 5 } : { marginLeft: 5 }]}
            activeOpacity={1}
        >
            <SharedElement id={`${product._id}.image`}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </SharedElement>
            <Text style={[styles.title, styles[`text${theme}`]]}>
                {product.brand}™ {product.name}
            </Text>
            <Text style={styles[`text${theme}`]}>{product.price}₪</Text>
        </TouchableOpacity>
    )
}

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        padding: 10,
        elevation: 1,
        marginBottom: 15
    },
    cardLight: {
        backgroundColor: lightMode.boxes
    },
    cardDark: {
        backgroundColor: darkMode.boxes
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        marginBottom: 10,
        // borderRadius: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        flexShrink: 1,
        marginBottom: 5
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    }
});