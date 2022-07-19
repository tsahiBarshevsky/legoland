import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const HomeScreen = () => {
    const navigation = useNavigation();

    const onSignOut = () => {
        signOut(authentication);
        navigation.replace('Login');
    }

    return (
        <View style={styles.container}>
            <Text>HomeScreen</Text>
            <TouchableOpacity onPress={onSignOut}>
                <Text>Sign out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    }
});