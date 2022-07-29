import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { lightMode, darkMode } from '../../utils/themes';

const Logo = ({ theme }) => {
    return (
        <View style={styles.container}>
            <View style={styles.upper}>
                <Image
                    source={require('../../../assets/Images/blocks.png')}
                    resizeMode='cover'
                    style={styles.image}
                />
                <View style={{ transform: [{ translateX: 4 }] }}>
                    <Text style={[styles.font1, styles.text1, styles[`text${theme}`]]}>Lego</Text>
                    <Text style={[styles.font1, styles.text2, styles[`text${theme}`]]}>Land </Text>
                </View>
            </View>
            <Text style={[styles.font2, styles.text3, styles[`text${theme}`]]}>a Lego Store</Text>
        </View>
    )
}

export default Logo;

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 25
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 15
    },
    upper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 80
    },
    lower: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text1: {
        transform: [{ translateY: 10 }]
    },
    text2: {
        transform: [{ translateY: -10 }]
    },
    text3: {
        textAlign: 'center'
    },
    font1: {
        fontFamily: 'SquarePeg',
        fontSize: 40,
    },
    font2: {
        fontFamily: 'BebasNeue',
        fontSize: 35,
        letterSpacing: 2
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    }
});