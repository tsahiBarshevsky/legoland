import React, { useState, useContext } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';
import { shipping } from '../../utils/utilities';
import { removeProductFromCart, updateProductInCart, emptyCart } from '../../redux/actions/cart';
import { ThemeContext } from '../../utils/ThemeManager';
import { darkMode, lightMode } from '../../utils/themes';
import { localhost } from '../../utils/utilities';
import { CartItem } from '../../components';

const CartScreen = () => {
    const { theme } = useContext(ThemeContext);
    const cart = useSelector(state => state.cart);
    const products = useSelector(state => state.products);
    const user = useSelector(state => state.user);
    const [checkout, setCheckout] = useState(
        cart.sum >= 200 ? cart.sum : cart.sum + shipping
    );
    const dispatch = useDispatch();
    const navigation = useNavigation();

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

    const onCheckout = () => {
        navigation.navigate('Checkout', {
            checkout: checkout,
            cart: cart,
            user: user
        });
    }

    const Separator = () => (
        <View style={[styles.separator, styles[`separator${theme}`]]} />
    )

    return cart.products.length > 0 ? (
        <View style={[styles.container, styles[`container${theme}`]]}>
            {cart.products.length === 1 ?
                <Text style={[styles.title, styles[`text${theme}`]]}>
                    There is one item in your cart
                </Text>
                :
                <Text style={[styles.title, styles[`text${theme}`]]}>
                    There are {cart.products.length} items in your cart
                </Text>
            }
            <Text style={styles.subtitle}>
                Review your order before you complete your purchase.
            </Text>
            <FlatList
                data={cart.products}
                keyExtractor={(item) => item.catalogNumber}
                renderItem={({ item, index }) => {
                    return (
                        <CartItem
                            item={item}
                            image={getImageLink(item)}
                            index={index}
                            increment={increment}
                            decrement={decrement}
                            removeProduct={removeProduct}
                        />
                    )
                }}
                ItemSeparatorComponent={Separator}
                style={styles.flatList}
            />
            <View style={styles.checkout}>
                <View style={styles.payment}>
                    <Text style={[styles.heading, styles[`text${theme}`]]}>Subtotal</Text>
                    <Text style={styles[`text${theme}`]}>{cart.sum}₪</Text>
                </View>
                <View style={styles.payment}>
                    <Text style={[styles.heading, styles[`text${theme}`]]}>Shipping</Text>
                    <Text style={styles[`text${theme}`]}>{cart.sum >= 200 ? 'FREE' : `${shipping}₪`}</Text>
                </View>
                <DashedLine
                    dashLength={5}
                    dashThickness={1}
                    dashColor={theme === 'Light' ? "black" : "white"}
                    style={styles.dashed}
                />
                <View style={styles.payment}>
                    <Text style={[styles.heading, styles[`text${theme}`]]}>Total</Text>
                    <Text style={styles[`text${theme}`]}>{checkout}₪</Text>
                </View>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity
                    onPress={onEmptyCart}
                    style={[styles.button, styles.unfill]}
                    activeOpacity={1}
                >
                    <Text style={styles[`text${theme}`]}>Empty Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onCheckout}
                    style={[styles.button, styles.fill]}
                    activeOpacity={1}
                >
                    <Text style={styles.textDark}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    ) : (
        <View style={[styles.emptyCart, styles[`container${theme}`]]}>
            <Image
                source={require('../../../assets/Images/shopping-cart.png')}
                resizeMode='center'
                style={styles.image}
            />
            <Text style={[styles.caption, styles[`text${theme}`]]}>
                Your shopping cart is empty. Browse the attractive Lego sets from Legoland!
            </Text>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.emptyCartButton}
                activeOpacity={1}
            >
                <Text style={styles.emptyCartButtonCaption}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        // paddingHorizontal: 15
    },
    containerLight: {
        backgroundColor: lightMode.background
    },
    containerDark: {
        backgroundColor: darkMode.background
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25
    },
    titles: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: 'blue'
    },
    title: {
        fontSize: 22,
        paddingHorizontal: 15
    },
    subtitle: {
        fontSize: 15,
        paddingLeft: 15,
        paddingRight: 100,
        color: 'grey'
    },
    quantity: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    separator: {
        height: 1,
        width: '92%',
        borderRadius: 2,
        marginVertical: 10,
        alignSelf: 'center'
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    checkout: {
        paddingVertical: 10
    },
    payment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15
    },
    heading: {
        fontWeight: 'bold'
    },
    dashed: {
        width: '92%',
        alignSelf: 'center',
        paddingVertical: 3
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    image: {
        width: 250,
        height: 250
    },
    caption: {
        fontSize: 20,
        textAlign: 'center'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 15
    },
    button: {
        width: '48%',
        height: 37,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    fill: {
        backgroundColor: lightMode.primary
    },
    unfill: {
        borderWidth: 2,
        borderColor: lightMode.primary
    },
    flatList: {
        marginTop: 15
    },
    emptyCartButton: {
        backgroundColor: lightMode.primary,
        borderRadius: 30,
        paddingHorizontal: 35,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 30
    },
    emptyCartButtonCaption: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1
    }
});