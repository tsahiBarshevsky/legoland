import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Filters = ({ filterPanelRef }) => {
    const [filter, setFilter] = useState('');
    const navigation = useNavigation();

    const onSearch = () => {
        if (filter.trim()) {
            navigation.navigate('Search', { name: filter });
            setTimeout(() => {
                setFilter('');
            }, 500);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                value={filter}
                placeholder="Search for a Lego set..."
                onChangeText={(text) => setFilter(text)}
                underlineColorAndroid="transparent"
                // placeholderTextColor={placeholder}
                // selectionColor={placeholder}
                onSubmitEditing={onSearch}
                returnKeyType='search'
                blurOnSubmit={false}
                style={styles.textInput}
            />
            <TouchableOpacity
                onPress={() => filterPanelRef.current?.open()}
                style={styles.button}
            >
                <Ionicons name="filter" size={20} color="white" />
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
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 5,
        paddingLeft: 12,
        paddingRight: 5,
        marginHorizontal: 15,
        marginBottom: 15
    },
    textInput: {
        flex: 1,
        marginRight: 10
    },
    button: {
        height: 35,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        borderRadius: 35 / 2
    }
});