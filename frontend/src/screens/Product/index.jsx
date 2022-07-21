import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { addNewProductToCart, updateProductInCart } from '../../redux/actions/cart';
import { localhost } from '../../utils/utilities';

const DURATION = 100;

const ProductScreen = ({ route }) => {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [quantityInCart, setQuantityInCart] = useState(0);
    const [index, setIndex] = useState(-1);
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const increment = () => {
        if (quantity < product.stock && quantity < (product.stock - quantityInCart))
            setQuantity(prevState => prevState + 1);
        else
            console.log('cant add anymore')
    }

    const decrement = () => {
        if (quantity > 1)
            setQuantity(prevState => prevState - 1);
    }

    const onAddNewProductToCart = () => {
        const editMode = cart.products.findIndex((p) => p.catalogNumber === product.catalogNumber) !== -1;
        if (!editMode) {
            const newProduct = {
                catalogNumber: product.catalogNumber,
                name: product.name,
                amount: quantity,
                sum: quantity * product.price
            };
            const newSum = cart.sum + newProduct.sum;
            fetch(`http://${localhost}/add-new-product-to-cart?id=${cart._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        product: newProduct,
                        amount: quantity,
                        currentSum: cart.sum
                    })
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error.message))
                .finally(() => {
                    dispatch(addNewProductToCart(newProduct, newSum));
                    navigation.goBack();
                });
        }
        else {
            // console.log('=========')
            // console.log({
            //     amount: cart.products[index].amount,
            //     newAmount: quantity,
            //     product: product,
            //     currentSum: cart.sum
            // })
            fetch(`http://${localhost}/update-product-in-cart?id=${cart._id}&type=increment`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: cart.products[index].amount,
                        newAmount: quantity,
                        product: product,
                        currentSum: cart.sum
                    })
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error.message))
                .finally(() => {
                    dispatch(updateProductInCart(index, quantity, 'increment', product.price));
                    navigation.goBack();
                });
        }
    }

    useEffect(() => {
        const index = cart.products.findIndex((p) => p.catalogNumber === product.catalogNumber);
        if (index !== -1) {
            setEditMode(true);
            setQuantityInCart(cart.products[index].amount);
            setIndex(index);
        }
    }, []);

    return (
        <View style={styles.container}>
            <SharedElement id={`${product._id}.image`}>
                <Image
                    source={{ uri: product.image }}
                    resizeMode='cover'
                    style={styles.image}
                />
            </SharedElement>
            <ScrollView overScrollMode='never'>
                <View style={styles.about}>
                    <Animatable.Text
                        style={styles.name}
                        animation='fadeInLeft'
                        delay={DURATION}
                    >
                        {product.name}({product.stock})
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
                    <TouchableOpacity onPress={increment}>
                        <Feather name="plus" size={15} color="black" />
                    </TouchableOpacity>
                    <Text>{quantity}</Text>
                    <TouchableOpacity onPress={decrement}>
                        <Feather name="minus" size={15} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={onAddNewProductToCart}
                    style={styles.button}
                >
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