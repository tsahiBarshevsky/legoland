import AsyncStorage from '@react-native-async-storage/async-storage';

const getTheme = async () => {
    try {
        const theme = await AsyncStorage.getItem('theme');
        return theme != null ? theme : 'Light';
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

const setTheme = async (theme) => {
    try {
        await AsyncStorage.setItem('theme', theme);
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

const getIsUsinSystemScheme = async () => {
    try {
        const systemScheme = await AsyncStorage.getItem('systemScheme');
        return systemScheme !== null ? systemScheme : 'false';
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

const setIsUsinSystemScheme = async (value) => {
    try {
        await AsyncStorage.setItem('systemScheme', value);
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

export {
    getTheme,
    setTheme,
    getIsUsinSystemScheme,
    setIsUsinSystemScheme
};