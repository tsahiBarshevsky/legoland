import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../utils/ThemeManager';
import { darkMode, lightMode } from '../../utils/themes';

// React Native Components
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';

const OrderCard = ({ order }) => {
    const { theme } = useContext(ThemeContext);
    const products = useSelector(state => state.products);
    const navigation = useNavigation();

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    const renderNumberOfItems = () => {
        var sum = 0;
        order.products.forEach((product) => sum += product.amount);
        if (sum === 1)
            return `${sum} item`;
        return `${sum} items`;
    }

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Order', { order })}
            activeOpacity={1}
        >
            <View style={styles.status}>
                <View style={styles.circle} />
                <Text style={styles[`text${theme}`]}>Paid</Text>
            </View>
            <Text style={styles[`text${theme}`]}>Order #{order.orderNumber}</Text>
            <FlatList
                data={order.products}
                horizontal
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                keyExtractor={(item) => item.catalogNumber}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: getImageLink(item) }}
                                resizeMode='stretch'
                                style={styles.image}
                            />
                        </View>
                    )
                }}
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 5 }} />}
                style={styles.flatList}
            />
            <View style={styles.summary}>
                <Text style={[styles[`text${theme}`], { marginRight: 12 }]}>
                    {renderNumberOfItems()}
                </Text>
                <Text style={styles[`text${theme}`]}>Total: {order.sum}₪</Text>
            </View>
        </TouchableOpacity>
    )
}

export default OrderCard;

const styles = StyleSheet.create({
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2e7d32',
        marginRight: 7
    },
    flatList: {
        marginTop: 10,
        marginBottom: 7
    },
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 95,
        height: 70,
        borderRadius: 15,
        paddingVertical: 5,
        backgroundColor: 'rgba(207, 216, 220, 0.25)'
    },
    image: {
        flex: 1,
        height: undefined,
        width: '100%',
        aspectRatio: 1
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-end'
    }
});