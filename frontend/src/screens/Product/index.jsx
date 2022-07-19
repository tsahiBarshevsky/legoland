import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';

const DURATION = 100;

const ProductScreen = ({ route }) => {
    const { product } = route.params;

    return (
        <View style={styles.container}>
            <SharedElement id={`${product._id}.image`}>
                <Image
                    source={{ uri: product.image }}
                    resizeMode='cover'
                    style={styles.image}
                />
            </SharedElement>
            <ScrollView>
                <View style={styles.about}>
                    <Animatable.Text
                        style={styles.name}
                        animation='fadeInLeft'
                        delay={DURATION}
                    >
                        {product.name}
                    </Animatable.Text>
                    <Animatable.Text
                        animation='fadeInRight'
                        delay={DURATION * 2}
                    >
                        {product.price}₪
                    </Animatable.Text>
                </View>
                <Animatable.Text
                    animation='fadeIn'
                    delay={DURATION * 3}
                    style={styles.description}
                >
                    {product.description}
                </Animatable.Text>
            </ScrollView>
            <Animatable.View
                style={styles.cartOptions}
                animation='fadeInUp'
                delay={DURATION * 4}
            >
                <View style={styles.quantity}>
                    <TouchableOpacity>
                        <Feather name="plus" size={15} color="black" />
                    </TouchableOpacity>
                    <Text>1</Text>
                    <TouchableOpacity>
                        <Feather name="minus" size={15} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: 'white' }}>Add to cart</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    )
}

ProductScreen.sharedElements = (route) => {
    const { product } = route.params;
    return [
        {
            id: `${product._id}.image`,
            animation: 'move',
            resize: 'clip'
        }
    ];
}

export default ProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    },
    image: {
        height: 250,
        width: '100%',
        marginVertical: 10
    },
    about: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        flexGrow: 1
    },
    cartOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15
    },
    button: {
        width: '48%',
        height: 37,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        borderRadius: 25
    },
    quantity: {
        width: '48%',
        height: 37,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2c3e50',
        borderRadius: 25,
        paddingHorizontal: 10
    }
});