import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { Entypo } from '@expo/vector-icons'

const Checkbox = ({ checked, setChecked, caption }) => {
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
            <Text style={styles.cpation}>{caption}</Text>
        </View>
    )
}

export default Checkbox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10
    },
    button: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderRadius: 25 / 2,
        borderColor: '#2c3e50',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checked: {
        backgroundColor: '#2c3e50'
    },
    unchecked: {
        backgroundColor: 'transparent'
    },
    cpation: {
        paddingLeft: 10
    }
});