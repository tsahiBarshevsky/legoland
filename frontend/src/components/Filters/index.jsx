import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';

const Filters = ({ filterPanelRef }) => {
    const { theme } = useContext(ThemeContext);
    const [filter, setFilter] = useState('');
    const navigation = useNavigation();

    const onSearch = () => {
        if (filter.trim()) {
            navigation.navigate('Search', { term: filter });
            setTimeout(() => {
                setFilter('');
            }, 500);
        }
    }

    return (
        <View style={[styles.container, styles[`container${theme}`]]}>
            <TextInput
                value={filter}
                placeholder="Search for a Lego set..."
                onChangeText={(text) => setFilter(text)}
                underlineColorAndroid="transparent"
                placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                onSubmitEditing={onSearch}
                returnKeyType='search'
                blurOnSubmit={false}
                style={[styles.textInput, styles[`textInput${theme}`]]}
            />
            <TouchableOpacity
                onPress={() => filterPanelRef.current?.open()}
                style={styles.button}
                activeOpacity={1}
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
        borderRadius: 25,
        paddingVertical: 5,
        paddingLeft: 15,
        paddingRight: 5,
        marginHorizontal: 15,
        marginBottom: 15
    },
    containerLight: {
        backgroundColor: lightMode.boxes
    },
    containerDark: {
        backgroundColor: darkMode.boxes
    },
    textInput: {
        flex: 1,
        marginRight: 10
    },
    textInputLight: {
        color: lightMode.text
    },
    textInputDark: {
        color: darkMode.text
    },
    button: {
        height: 35,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightMode.primary,
        borderRadius: 35 / 2
    }
});