import React, { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { getTheme, setTheme as changeTheme } from './AsyncStorageHandler';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('');

    useEffect(() => {
        getTheme().then((theme) => setTheme(theme));
    }, []);

    const toggleTheme = async (newTheme) => {
        switch (newTheme) {
            case 'Light':
                setTheme('Light');
                changeTheme('Light'); // Update AsyncStorage
                break;
            case 'Dark':
                setTheme('Dark');
                changeTheme('Dark'); // Update AsyncStorage
                break;
            default:
                const colorScheme = Appearance.getColorScheme();
                setTheme(colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1));
                changeTheme(colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1));
                break;
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}