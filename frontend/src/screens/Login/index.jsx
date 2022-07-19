import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { authentication } from '../../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// React Native components
import {
    StyleSheet,
    Platform,
    StatusBar,
    SafeAreaView,
    TextInput,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    Keyboard
} from 'react-native';

const LoginScreen = () => {
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const passwordRef = useRef(null);
    const navigation = useNavigation();

    const onSignIn = () => {
        signInWithEmailAndPassword(authentication, email, password)
            .then(() => navigation.replace('Splash'))
            .catch((error) => console.log(error.message));
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Splash');
        });
        return unsubscribe;
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
                keyboardShouldPersistTaps='handled'
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Text style={[styles.text, styles.route]}>Login</Text>
                    <Text style={[styles.text, styles.title]}>Email</Text>
                    <View style={styles.textInputWrapper}>
                        <MaterialIcons
                            name="alternate-email"
                            size={20}
                            color="black"
                            style={styles.icon}
                        />
                        <TextInput
                            value={email}
                            placeholder="what's your email?"
                            onChangeText={(text) => setEmail(text)}
                            keyboardType='email-address'
                            underlineColorAndroid="transparent"
                            // placeholderTextColor={placeholder}
                            // selectionColor={placeholder}
                            returnKeyType='next'
                            onSubmitEditing={() => passwordRef.current.focus()}
                            blurOnSubmit={false}
                            style={styles.textInput}
                        />
                    </View>
                    <Text style={[styles.text, styles.title]}>Password</Text>
                    <View style={styles.textInputWrapper}>
                        <Entypo
                            name="lock"
                            size={20}
                            color="black"
                            style={styles.icon}
                        />
                        <TextInput
                            value={password}
                            ref={passwordRef}
                            placeholder="What's your password?"
                            secureTextEntry={passwordVisibilty}
                            onChangeText={(text) => setPassword(text)}
                            underlineColorAndroid="transparent"
                            // placeholderTextColor={placeholder}
                            // selectionColor={placeholder}
                            onSubmitEditing={() => onSignIn()}
                            style={styles.textInput}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisibilty(!passwordVisibilty)}>
                            {passwordVisibilty ?
                                <FontAwesome
                                    name="eye"
                                    size={20}
                                    color="rgba(0, 0, 0, 0.75)"
                                    style={styles.eye}
                                />
                                :
                                <FontAwesome
                                    name="eye-slash"
                                    size={20}
                                    color="rgba(0, 0, 0, 0.75)"
                                    style={styles.eye}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        // onPress={() => navigation.navigate('ResetPassword')}
                        style={styles.password}
                        activeOpacity={1}
                    >
                        <Text style={styles.text}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSignIn}
                        style={styles.button}
                        activeOpacity={0.8}
                        disabled={disabled}
                    >
                        <Text style={[styles.text, styles.buttonText]}>
                            Login!
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Registration')}
                        style={styles.registration}
                        activeOpacity={1}
                    >
                        <Text style={styles.text}>First time here? Register</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    }
});