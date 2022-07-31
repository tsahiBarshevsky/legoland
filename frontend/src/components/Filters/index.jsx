import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';

const Filters = ({ filterPanelRef }) => {
    const { theme } = useContext(ThemeContext);
    const [filter, setFilter] = useState('');
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const navigation = useNavigation();

    const onSearch = () => {
        if (filter.trim()) {
            navigation.navigate('Search', { term: filter });
            setTimeout(() => {
                setFilter('');
            }, 500);
        }
    }

    const onOpenFilterPanel = () => {
        if (isKeyboardOpen) {
            Keyboard.dismiss();
            setTimeout(() => {
                filterPanelRef.current?.open();
            }, 200);
        }
        else
            filterPanelRef.current?.open();
    }

    useEffect(() => {
        const keyboardOpenListener = Keyboard.addListener("keyboardDidShow", () =>
            setIsKeyboardOpen(true)
        );
        const keyboardCloseListener = Keyboard.addListener("keyboardDidHide", () =>
            setIsKeyboardOpen(false)
        );

        return () => {
            if (keyboardOpenListener) keyboardOpenListener.remove();
            if (keyboardCloseListener) keyboardCloseListener.remove();
        };
    }, []);

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
                onPress={onOpenFilterPanel}
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