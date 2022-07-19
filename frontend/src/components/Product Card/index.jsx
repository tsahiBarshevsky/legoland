import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';

const ProductCard = ({ product }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Product', { product })}
            style={styles.card}
        >
            <SharedElement id={`${product._id}.image`}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </SharedElement>
            <Text>{product.name}</Text>
            {/* <Text>{product.description}</Text> */}
            <Text>{product.price}₪</Text>
        </TouchableOpacity>
    )
}

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        width: '50%',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10,
        elevation: 1
    },
    image: {
        width: '100%',
        height: 200
    }
});