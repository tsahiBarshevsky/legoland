import React, { useState } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { shipping } from '../../utils/utilities';
import { removeProductFromCart, updateProductInCart, emptyCart } from '../../redux/actions/cart';
import { localhost } from '../../utils/utilities';

const CartScreen = () => {
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const [checkout, setCheckout] = useState(
        cart.sum >= 200 ? cart.sum : cart.sum + shipping
    );
    const dispatch = useDispatch();

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    const increment = (product, index) => {
        const item = products.find((e) => e.catalogNumber === product.catalogNumber);
        if (product.amount < item.stock) {
            fetch(`http://${localhost}/update-product-in-cart?id=${cart._id}&type=increment`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: product.amount,
                        newAmount: 1,
                        product: item,
                        currentSum: cart.sum
                    })
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error.message))
                .finally(() => {
                    dispatch(updateProductInCart(index, 1, 'increment', item.price));
                    const newCheckout = cart.sum + item.price;
                    setCheckout(newCheckout >= 200 ? newCheckout : newCheckout + shipping);
                });
        }
    }

    const decrement = (product, index) => {
        if (product.amount > 1) {
            const item = products.find((e) => e.catalogNumber === product.catalogNumber);
            fetch(`http://${localhost}/update-product-in-cart?id=${cart._id}&type=decrement`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: product.amount,
                        newAmount: 1,
                        product: item,
                        currentSum: cart.sum
                    })
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error.message))
                .finally(() => {
                    dispatch(updateProductInCart(index, 1, 'decrement', item.price));
                    const newCheckout = cart.sum - item.price;
                    setCheckout(newCheckout >= 200 ? newCheckout : newCheckout + shipping);
                })
        }
    }

    const removeProduct = (product, sum, index) => {
        fetch(`http://${localhost}/remove-product-from-cart?id=${cart._id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product: product,
                    sum: cart.sum - sum
                })
            })
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(error => console.log(error.message))
            .finally(() => {
                dispatch(removeProductFromCart(index, sum));
                const newCheckout = cart.sum - sum;
                setCheckout(newCheckout >= 200 ? newCheckout : newCheckout + shipping);
            });
    }

    const onEmptyCart = () => {
        fetch(`http://${localhost}/empty-cart?id=${cart._id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .finally(() => {
                dispatch(emptyCart());
                setCheckout(0);
            });
    }

    const Separator = () => (
        <View style={styles.separator} />
    )

    return (
        <View style={styles.container}>
            {cart.products.length === 1 ?
                <Text>There is one item in your cart</Text>
                :
                <Text>There are {cart.products.length} items in your cart</Text>
            }
            <Text>Review your order before you complete your purchase</Text>
            <FlatList
                data={cart.products}
                keyExtractor={(item) => item.catalogNumber}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            <Image
                                source={{ uri: getImageLink(item) }}
                                resizeMode='center'
                                style={{ width: 80, height: 80 }}
                            />
                            <Text>{item.name}</Text>
                            <View style={styles.quantity}>
                                <TouchableOpacity onPress={() => increment(item, index)}>
                                    <Feather name="plus" size={15} color="black" />
                                </TouchableOpacity>
                                <Text>{item.amount}</Text>
                                <TouchableOpacity onPress={() => decrement(item, index)}>
                                    <Feather name="minus" size={15} color="black" />
                                </TouchableOpacity>
                            </View>
                            <Text>{item.sum}₪</Text>
                            <TouchableOpacity onPress={() => removeProduct(item, item.sum, index)}>
                                <Text>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                ItemSeparatorComponent={Separator}
                style={{ marginTop: 10 }}
            />
            <View style={styles.checkout}>
                <View style={styles.payment}>
                    <Text>Subtotal</Text>
                    <Text>{cart.sum}₪</Text>
                </View>
                <View style={styles.payment}>
                    <Text>Shipping</Text>
                    <Text>{cart.sum >= 200 ? 'FREE' : `${shipping}₪`}</Text>
                </View>
                <View style={styles.payment}>
                    <Text>Total</Text>
                    <Text>{checkout}₪</Text>
                </View>
            </View>
            <View style={styles.options}>
                <TouchableOpacity onPress={onEmptyCart}>
                    <Text>Empty cart</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    },
    quantity: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    separator: {
        height: 1,
        width: '100%',
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        marginVertical: 5
    },
    checkout: {
        paddingVertical: 10
    },
    payment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // marginBottom: 5
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    }
});