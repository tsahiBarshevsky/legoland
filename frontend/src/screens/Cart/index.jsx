import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { shipping } from '../../utils/utilities';
import { removeProductFromCart, updateProductInCart } from '../../redux/actions/cart';

const CartScreen = () => {
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    const increment = (product, index) => {
        const item = products.find((e) => e.catalogNumber === product.catalogNumber);
        if (product.amount < item.stock)
            dispatch(updateProductInCart(index, 1, 'increment', item.price));
    }

    const decrement = (product, index) => {
        const item = products.find((e) => e.catalogNumber === product.catalogNumber);
        if (product.amount > 1)
            dispatch(updateProductInCart(index, 1, 'decrement', item.price));
    }

    const removeProduct = (sum, index) => {
        dispatch(removeProductFromCart(index, sum));
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
                            <TouchableOpacity onPress={() => removeProduct(item.sum, index)}>
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
                    <Text>Amount payable</Text>
                    <Text>{cart.sum >= 200 ? cart.sum : cart.sum + shipping}₪</Text>
                </View>
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
        marginBottom: 5
    }
});