import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Filters = () => {
    const [filter, setFilter] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                value={filter}
                placeholder="Search for a Lego..."
                onChangeText={(text) => setFilter(text)}
                underlineColorAndroid="transparent"
                // placeholderTextColor={placeholder}
                // selectionColor={placeholder}
                // onSubmitEditing={() => passwordRef.current.focus()}
                returnKeyType='search'
                blurOnSubmit={false}
                style={styles.textInput}
            />
            <TouchableOpacity
                style={styles.button}
            >
                <Ionicons name="filter" size={18} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default Filters;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 100,
        paddingVertical: 3,
        paddingLeft: 12,
        paddingRight: 3
    },
    textInput: {
        flex: 1
    },
    button: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        borderRadius: 15
    }
});