import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../utils/ThemeManager';
import { darkMode, lightMode } from '../../utils/themes';

const CartItem = (props) => {
    const { item, image, index, increment, decrement, removeProduct } = props;
    const { theme } = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            {/* <Image
                source={{ uri: image }}
                resizeMode='center'
                style={styles.image}
            /> */}
            <View style={styles.image} />
            <View style={styles.wrapper}>
                <Text style={[styles.title, styles[`text${theme}`]]}>{item.name}</Text>
                <Text style={styles[`text${theme}`]}>{item.sum}₪</Text>
                <View style={styles.options}>
                    <View style={styles.quantity}>
                        <TouchableOpacity
                            onPress={() => increment(item, index)}
                            style={styles.button}
                            activeOpacity={0.85}
                        >
                            <Feather name="plus" size={12} color={theme === 'Light' ? "black" : "white"} />
                        </TouchableOpacity>
                        <Text style={[styles.amount, styles[`text${theme}`]]}>{item.amount}</Text>
                        <TouchableOpacity
                            onPress={() => decrement(item, index)}
                            style={styles.button}
                            activeOpacity={0.85}
                        >
                            <Feather name="minus" size={12} color={theme === 'Light' ? "black" : "white"} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => removeProduct(item, item.sum, index)}
                        style={styles.button}
                        activeOpacity={0.85}
                    >
                        <AntDesign name="close" size={12} color={theme === 'Light' ? "black" : "white"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CartItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 15
    },
    image: {
        width: 120,
        height: 100,
        marginRight: 15,
        backgroundColor: 'green',
        borderRadius: 15
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        flexShrink: 1,
        marginBottom: 2
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    wrapper: {
        flex: 1,
        height: '100%'
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    quantity: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    button: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25 / 2,
        borderWidth: 1,
        borderColor: lightMode.primary
    },
    amount: {
        marginHorizontal: 7
    }
});