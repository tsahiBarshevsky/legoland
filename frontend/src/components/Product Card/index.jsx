import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';

const ProductCard = ({ product, index }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Product', { product })}
            style={[styles.card, index % 2 === 0 ? { marginRight: 5 } : { marginLeft: 5 }]}
            activeOpacity={1}
        >
            <SharedElement id={`${product._id}.image`}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </SharedElement>
            <Text style={styles.title}>{product.name}{product.name}</Text>
            <Text>{product.price}₪</Text>
            <Text>{product.brand}</Text>
            <Text>{product.pieces} pieces</Text>
            <Text>{product.ages}+</Text>
        </TouchableOpacity>
    )
}

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        backgroundColor: 'white',
        padding: 10,
        elevation: 1,
        marginBottom: 15
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        borderRadius: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        flexGrow: 1,
        marginBottom: 5
    }
});