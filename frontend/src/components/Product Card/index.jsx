import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const ProductCard = ({ product }) => {
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
            />
            <Text>{product.name}</Text>
            <Text>{product.description}</Text>
            <Text>{product.price}₪</Text>
        </View>
    )
}

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        width: '50%',
        marginBottom: 10,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5
    },
    image: {
        width: '100%',
        height: 200
    }
});