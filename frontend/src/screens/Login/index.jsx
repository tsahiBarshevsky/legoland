import React, { useRef, useState, useContext, useEffect } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Formik, ErrorMessage } from 'formik';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BallIndicator, UIActivityIndicator } from 'react-native-indicators';
import { ThemeContext } from '../../utils/ThemeManager';
import { loginSchema } from '../../utils/schemas';
import { darkMode, lightMode } from '../../utils/themes';
import { authentication } from '../../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Logo } from '../../components';

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
    const { theme } = useContext(ThemeContext);
    const [loaded, setLoaded] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const formRef = useRef(null);
    const passwordRef = useRef(null);
    const navigation = useNavigation();

    const initialValues = {
        email: '',
        password: ''
    }

    const onSignIn = (values) => {
        setDisabled(true);
        Keyboard.dismiss();
        setTimeout(() => {
            signInWithEmailAndPassword(authentication, values.email.trim(), values.password)
                .catch((error) => console.log(error.message))
                .finally(() => setDisabled(false));
        }, 500);
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Splash');
            else
                setTimeout(() => {
                    setLoaded(true);
                }, 1000);
        });
        return unsubscribe;
    }, []);

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

    return loaded ? (
        <>
            <ExpoStatusBar style={theme === 'Light' ? 'dark' : 'light'} />
            <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
                <Logo theme={theme} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 15 }}
                    keyboardShouldPersistTaps='handled'
                >
                    <KeyboardAvoidingView
                        enabled
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                    >
                        <Formik
                            initialValues={initialValues}
                            validationSchema={loginSchema}
                            enableReinitialize
                            onSubmit={(values) => onSignIn(values)}
                            innerRef={formRef}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                                return (
                                    <View style={{ paddingHorizontal: 15 }}>
                                        <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                            <TextInput
                                                placeholder='Email...'
                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('email')}
                                                returnKeyType='next'
                                                onSubmitEditing={() => passwordRef.current?.focus()}
                                                style={[styles.textInput, styles[`textInput${theme}`]]}
                                            />
                                        </View>
                                        <ErrorMessage
                                            name='email'
                                            render={(message) => {
                                                return (
                                                    <View style={styles.errorContainer}>
                                                        <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color='#b71c1c' />
                                                        <Text style={styles.error}>{message}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                        <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                            <TextInput
                                                placeholder='Password...'
                                                value={values.password}
                                                ref={passwordRef}
                                                onChangeText={handleChange('password')}
                                                secureTextEntry={passwordVisibilty}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('password')}
                                                onSubmitEditing={handleSubmit}
                                                style={[styles.textInput, styles[`textInput${theme}`]]}
                                            />
                                            <TouchableOpacity onPress={() => setPasswordVisibilty(!passwordVisibilty)}>
                                                {passwordVisibilty ?
                                                    <FontAwesome
                                                        name="eye"
                                                        size={20}
                                                        style={[styles.eye, styles[`eye${theme}`]]}
                                                    />
                                                    :
                                                    <FontAwesome
                                                        name="eye-slash"
                                                        size={20}
                                                        style={[styles.eye, styles[`eye${theme}`]]}
                                                    />
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        <ErrorMessage
                                            name='password'
                                            render={(message) => {
                                                return (
                                                    <View style={styles.errorContainer}>
                                                        <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color='#b71c1c' />
                                                        <Text style={styles.error}>{message}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                )
                            }}
                        </Formik>
                    </KeyboardAvoidingView>
                </ScrollView>
                <TouchableOpacity
                    onPress={() => formRef.current?.handleSubmit()}
                    style={[styles.button, isKeyboardOpen && { display: 'none' }]}
                    activeOpacity={1}
                    disabled={disabled}
                >
                    {disabled ?
                        <UIActivityIndicator size={25} count={12} color='white' />
                        :
                        <Text style={[styles.textDark, styles.buttonCaption]}>
                            Sign In!
                        </Text>
                    }
                </TouchableOpacity>
                <View style={[styles.signUp, isKeyboardOpen && { display: 'none' }]}>
                    <Text style={styles[`text${theme}`]}>
                        Doesn't have an account?
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('Registration')}
                    >
                        <Text style={[styles.link, styles[`text${theme}`]]}> Sign up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    ) : (
        <>
            <ExpoStatusBar style={theme === 'Light' ? 'dark' : 'light'} />
            <SafeAreaView style={[styles.loadingContainer, styles[`container${theme}`]]}>
                <BallIndicator size={30} count={8} color={theme === 'Light' ? 'black' : 'white'} />
            </SafeAreaView>
        </>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    containerLight: {
        backgroundColor: lightMode.background
    },
    containerDark: {
        backgroundColor: darkMode.background
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    textInputTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10
    },
    textInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10
    },
    textInputWrapperLight: {
        backgroundColor: lightMode.boxes
    },
    textInputWrapperDark: {
        backgroundColor: darkMode.boxes
    },
    textInput: {
        flex: 1,
    },
    textInputLight: {
        color: lightMode.text
    },
    textInputDark: {
        color: darkMode.text
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3
    },
    errorIcon: {
        marginRight: 5
    },
    error: {
        color: '#b71c1c',
        fontWeight: 'bold'
    },
    eye: {
        marginLeft: 10
    },
    eyeLight: {
        color: 'rgba(0, 0, 0, 0.75)'
    },
    eyeDark: {
        color: 'rgba(255, 255, 255, 0.75)'
    },
    button: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightMode.primary,
        borderRadius: 25,
        marginTop: 10,
        marginHorizontal: 15,
        elevation: 1,
        marginBottom: 5
    },
    buttonCaption: {
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5
    },
    signUp: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    link: {
        fontWeight: 'bold'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});