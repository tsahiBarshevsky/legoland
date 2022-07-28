import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { Entypo } from '@expo/vector-icons'
import { darkMode, lightMode } from '../../utils/themes';

const Checkbox = ({ checked, setChecked, caption, theme }) => {
    return (
        <View style={styles.container}>
            <TouchableScale
                onPress={() => setChecked(!checked)}
                activeScale={0.85}
                useNativeDriver
                style={[styles.button, checked ? styles.checked : styles.unchecked]}
            >
                {checked && <Entypo name="check" size={13} color='white' />}
            </TouchableScale>
            <Text style={[styles.cpation, styles[`caption${theme}`]]}>{caption}</Text>
        </View>
    )
}

export default Checkbox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 5
    },
    button: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderRadius: 25 / 2,
        borderColor: lightMode.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checked: {
        backgroundColor: lightMode.primary
    },
    unchecked: {
        backgroundColor: 'transparent'
    },
    cpation: {
        paddingLeft: 10
    },
    captionLight: {
        color: lightMode.text
    },
    captionDark: {
        color: darkMode.text
    }
});