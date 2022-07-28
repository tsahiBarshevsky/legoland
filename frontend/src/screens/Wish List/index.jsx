import React, { useContext } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';
import { ProductCard } from '../../components';
import { ThemeContext } from '../../utils/ThemeManager';
import { darkMode, lightMode } from '../../utils/themes';

const WishListScreen = () => {
    const { theme } = useContext(ThemeContext);
    const wishList = useSelector(state => state.wishList);
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            {wishList.products.length > 0 ?
                <ScrollView>
                    <Text style={[styles.title, styles[`text${theme}`]]}>My Wishlist</Text>
                    <MasonryList
                        data={wishList.products}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, i }) => {
                            return (
                                <ProductCard
                                    product={item}
                                    index={i}
                                />
                            )
                        }}
                        contentContainerStyle={styles.contentContainerStyle}
                        style={{ alignSelf: 'stretch' }}
                    />
                </ScrollView>
                :
                <View style={[styles.emptyWishlist, styles[`container${theme}`]]}>
                    <Image
                        source={require('../../../assets/Images/wish-list.png')}
                        resizeMode='center'
                        style={styles.image}
                    />
                    <Text style={[styles.caption, styles[`text${theme}`]]}>
                        Your wishlist is empty. Browse the attractive Lego sets from Legoland!
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.emptyWishlistButton}
                        activeOpacity={1}
                    >
                        <Text style={styles.emptyWishlistButtonCaption}>Start Exploring</Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    )
}


export default WishListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    containerLight: {
        backgroundColor: lightMode.background
    },
    containerDark: {
        backgroundColor: darkMode.background
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 15
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    contentContainerStyle: {
        marginBottom: 5,
        paddingHorizontal: 15,
        alignSelf: 'stretch'
    },
    caption: {
        fontSize: 20,
        textAlign: 'center'
    },
    image: {
        width: 250,
        height: 250
    },
    emptyWishlist: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25
    },
    emptyWishlistButton: {
        backgroundColor: lightMode.primary,
        borderRadius: 30,
        paddingHorizontal: 35,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 30,
        elevation: 1
    },
    emptyWishlistButtonCaption: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1
    }
});