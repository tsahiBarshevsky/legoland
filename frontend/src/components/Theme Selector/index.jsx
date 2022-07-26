import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';
import { setIsUsinSystemScheme as updateIsUsingSystemScheme } from '../../utils/AsyncStorageHandler';

const ThemeSelector = ({ themeSelectorRef, isUsinSystemScheme, setIsUsinSystemScheme }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const onChangeTheme = (newTheme) => {
        themeSelectorRef.current?.close();
        setTimeout(() => {
            toggleTheme(newTheme);
            if (newTheme === 'System') {
                updateIsUsingSystemScheme('true'); // Update AsyncStorage
                setIsUsinSystemScheme('true');
            }
            else {
                updateIsUsingSystemScheme('false'); // Update AsyncStorage
                setIsUsinSystemScheme('false');
            }
        }, 500);
    }

    return (
        <Modalize
            ref={themeSelectorRef}
            threshold={50}
            adjustToContentHeight
            withHandle={false}
            modalStyle={[styles.modalStyle, styles[`modalBackground${theme}`]]}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
        >
            <View style={styles.bottomSheetContainer}>
                <Text style={[styles.title, styles[`text${theme}`]]}>Select theme</Text>
                <TouchableOpacity
                    onPress={() => onChangeTheme('Light')}
                    style={styles.button}
                    activeOpacity={1}
                >
                    <View style={styles.wrapper}>
                        <View style={styles.iconWrpper}>
                            <Ionicons name="sunny" size={20} color="#4587d0" />
                        </View>
                        <Text style={styles[`text${theme}`]}>Light</Text>
                    </View>
                    {theme === 'Light' && isUsinSystemScheme === 'false' &&
                        <AntDesign name="check" size={17} color='black' />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onChangeTheme('Dark')}
                    style={styles.button}
                    activeOpacity={1}
                >
                    <View style={styles.wrapper}>
                        <View style={styles.iconWrpper}>
                            <Ionicons name="moon" size={20} color="#f08e08" />
                        </View>
                        <Text style={styles[`text${theme}`]}>Dark</Text>
                    </View>
                    {theme === 'Dark' && isUsinSystemScheme === 'false' &&
                        <AntDesign name="check" size={16} color='white' />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onChangeTheme('System')}
                    style={styles.button}
                    activeOpacity={1}
                >
                    <View style={styles.wrapper}>
                        <View style={styles.iconWrpper}>
                            <Ionicons name="settings-sharp" size={20} color="#5f7177" />
                        </View>
                        <Text style={styles[`text${theme}`]}>System</Text>
                    </View>
                    {isUsinSystemScheme === 'true' &&
                        <AntDesign name="check" size={17} color={styles[`mark${theme}`]} />
                    }
                </TouchableOpacity>
            </View>
        </Modalize>
    )
}

export default ThemeSelector;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalBackgroundLight: {
        backgroundColor: lightMode.background
    },
    modalBackgroundDark: {
        backgroundColor: darkMode.background
    },
    textLight: {
        color: 'black'
    },
    textDark: {
        color: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 15,
        letterSpacing: 1
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        paddingHorizontal: 5
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconWrpper: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
    }
});