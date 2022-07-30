import React, { useState, useEffect, useContext } from 'react';
import { SharedElement } from 'react-navigation-shared-element';
import * as Animatable from 'react-native-animatable';
import { Feather, AntDesign, Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { addNewProductToCart, updateProductInCart } from '../../redux/actions/cart';
import { addNewProductToWishList, removeProductFromWishList } from '../../redux/actions/wishList';
import { localhost } from '../../utils/utilities';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';

// React Native Components
import {
    StyleSheet,
    Platform,
    StatusBar,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';

const DURATION = 100;

const ProductScreen = ({ route }) => {
    const { product } = route.params;
    const { theme } = useContext(ThemeContext);
    const [quantity, setQuantity] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [quantityInCart, setQuantityInCart] = useState(0);
    const [index, setIndex] = useState(-1);
    const [inWishList, setInWishList] = useState(false);
    const cart = useSelector(state => state.cart);
    const wishList = useSelector(state => state.wishList);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const increment = () => {
        if (quantity < product.stock && quantity < (product.stock - quantityInCart))
            setQuantity(prevState => prevState + 1);
    }

    const decrement = () => {
        if (quantity > 1)
            setQuantity(prevState => prevState - 1);
    }

    const onAddNewProductToWishList = () => {
        const index = wishList.products.findIndex((p) => p.catalogNumber === product.catalogNumber);
        if (index === -1) {
            fetch(`http://${localhost}/add-new-product-to-wish-list?id=${wishList._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ product })
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error.message))
                .finally(() => {
                    dispatch(addNewProductToWishList(product));
                    setInWishList(true);
                });
        }
        else {
            fetch(`http://${localhost}/remove-product-from-wish-list?id=${wishList._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ product })
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error.message))
                .finally(() => {
                    dispatch(removeProductFromWishList(index));
                    setInWishList(false);
                });
        }
    }

    const notify = () => {
        Toast.show({
            type: 'cartToast',
            position: 'bottom',
            bottomOffset: 25,
            props: {
                quantity: quantity,
                image: product.image,
                theme: theme
            }
        });
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
                    setTimeout(() => {
                        notify();
                    }, 500);
                });
        }
        else {
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
                    setTimeout(() => {
                        notify();
                    }, 200);
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
        const index2 = wishList.products.findIndex((p) => p.catalogNumber === product.catalogNumber);
        if (index2 !== -1)
            setInWishList(true);
    }, []);

    return (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Entypo name="chevron-left" size={24} style={styles[`icon${theme}`]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddNewProductToWishList}>
                    {inWishList ?
                        <AntDesign name="heart" size={20} color="red" />
                        :
                        <AntDesign name="hearto" size={20} color="red" />
                    }
                </TouchableOpacity>
            </View>
            <SharedElement style={{ paddingHorizontal: 15 }} id={`${product._id}.image`}>
                <Image
                    source={{ uri: product.image }}
                    resizeMode='stretch'
                    style={styles.image}
                />
            </SharedElement>
            <ScrollView
                overScrollMode='never'
                contentContainerStyle={styles.contentContainerStyle}
            >
                <View style={styles.about}>
                    <Animatable.Text
                        style={[styles.name, styles[`text${theme}`]]}
                        animation='fadeInLeft'
                        delay={DURATION}
                    >
                        {product.name}
                    </Animatable.Text>
                    <Animatable.Text
                        animation='fadeInRight'
                        delay={DURATION * 2}
                        style={[styles.price, styles[`text${theme}`]]}
                    >
                        {product.price}₪
                    </Animatable.Text>
                </View>
                <Animatable.Text
                    animation='fadeIn'
                    delay={DURATION * 3}
                    style={[styles.title, styles[`text${theme}`]]}
                >
                    About this set
                </Animatable.Text>
                <Animatable.Text
                    animation='fadeIn'
                    delay={DURATION * 3}
                    style={[styles.description, styles[`text${theme}`]]}
                >
                    {product.description}
                </Animatable.Text>
                <Animatable.Text
                    animation='fadeIn'
                    delay={DURATION * 4}
                    style={[styles.title, styles[`text${theme}`]]}
                >
                    Specifications
                </Animatable.Text>
                <Animatable.Text
                    animation='fadeIn'
                    delay={DURATION * 4}
                    style={styles[`text${theme}`]}
                >
                    Model: #{product.catalogNumber}
                </Animatable.Text>
                <Animatable.Text
                    animation='fadeIn'
                    delay={DURATION * 4}
                    style={styles[`text${theme}`]}
                >
                    Ages: {product.ages}+
                </Animatable.Text>
                <Animatable.Text
                    animation='fadeIn'
                    delay={DURATION * 4}
                    style={styles[`text${theme}`]}
                >
                    Pieces: {product.pieces}
                </Animatable.Text>
            </ScrollView>
            <Animatable.View
                style={styles.cartOptions}
                animation='fadeInUp'
                delay={DURATION * 4}
            >
                <View style={[styles.quantity, product.stock > 0 ? styles.inStock : styles.outOfStock]}>
                    <TouchableOpacity
                        onPress={increment}
                        disabled={product.stock === 0}
                    >
                        <Feather name="plus" size={15} style={styles[`icon${theme}`]} />
                    </TouchableOpacity>
                    <Text style={styles[`text${theme}`]}>{quantity}</Text>
                    <TouchableOpacity
                        onPress={decrement}
                        disabled={product.stock === 0}
                    >
                        <Feather name="minus" size={15} style={styles[`icon${theme}`]} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={onAddNewProductToCart}
                    disabled={product.stock === 0}
                    style={[
                        styles.button,
                        product.stock > 0 ? styles.buttonInStock : styles.buttonOutOfStock
                    ]}
                >
                    <Text style={styles.buttonCaption}>
                        {product.stock > 0 ? "Add to cart!" : "Out of stock"}
                    </Text>
                </TouchableOpacity>
            </Animatable.View>
        </SafeAreaView >
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
    price: {
        fontWeight: 'bold'
    },
    iconLight: {
        color: lightMode.text
    },
    iconDark: {
        color: darkMode.text
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 10
    },
    image: {
        width: '100%',
        height: 250,
        marginBottom: 10
    },
    about: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 5
    },
    detail: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconWrapper: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3
    },
    stock: {
        fontSize: 13,
        lineHeight: 15,
        textAlign: 'center'
    },
    separator: {
        width: 1,
        height: '50%',
        borderRadius: 0.5,
        alignSelf: 'center',
        marginHorizontal: 10
    },
    separatorColorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)'
    },
    separatorColorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        flexShrink: 1,
        marginRight: 10
    },
    title: {
        fontSize: 18,
        textDecorationLine: 'underline',
        marginBottom: 3
    },
    contentContainerStyle: {
        paddingHorizontal: 15,
    },
    description: {
        flexShrink: 1,
        marginBottom: 10
    },
    cartOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15
    },
    button: {
        width: '48%',
        height: 37,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    buttonInStock: {
        backgroundColor: '#5F7ADB',
    },
    buttonOutOfStock: {
        backgroundColor: '#ACACAC',
    },
    buttonCaption: {
        color: 'white',
        textTransform: 'capitalize'
    },
    quantity: {
        width: '48%',
        height: 37,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 25,
        paddingHorizontal: 10
    },
    inStock: {
        borderColor: '#5F7ADB',
    },
    outOfStock: {
        borderColor: '#ACACAC'
    }
});