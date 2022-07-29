import React, { useRef, useState, useContext, useEffect } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { UIActivityIndicator } from 'react-native-indicators';
import { localhost } from '../../utils/utilities';
import { ThemeContext } from '../../utils/ThemeManager';
import { registrationSchema } from '../../utils/schemas';
import { darkMode, lightMode } from '../../utils/themes';
import { authentication } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'
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

const RegistrationScreen = () => {
    const { theme } = useContext(ThemeContext);
    const [disabled, setDisabled] = useState(false);
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const formRef = useRef(null);
    const passwordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const phoneRef = useRef(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const initialValues = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: ''
    }

    const onRegister = (values) => {
        setDisabled(true);
        createUserWithEmailAndPassword(authentication, values.email.trim(), values.password)
            .then(() => {
                fetch(`http://${localhost}/add-new-user`,
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            uid: authentication.currentUser.uid,
                            email: values.email,
                            phone: values.phone,
                            firstName: values.firstName,
                            lastName: values.lastName,
                        })
                    })
                    .then((res) => res.json())
                    .then((res) => {
                        dispatch({
                            type: 'SET_CART', cart: {
                                _id: res.cartID,
                                owner: authentication.currentUser.uid,
                                products: [],
                                sum: 0
                            }
                        });
                        dispatch({
                            type: 'SET_USER', user: {
                                _id: res.userID,
                                uid: authentication.currentUser.uid,
                                email: values.email,
                                phone: values.phone,
                                firstName: values.firstName,
                                lastName: values.lastName,
                                addresses: {
                                    primary: {},
                                    secondary: {}
                                }
                            }
                        });
                        dispatch({
                            type: 'SET_WISH_LIST', wishList: {
                                _id: res.wishListID,
                                products: [],
                                owner: authentication.currentUser.uid
                            }
                        });
                    })
                    .catch((error) => console.log(error.message))
                    .finally(() => setDisabled(false));
            })
            .catch((error) => console.log(error.message));
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
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            <Logo theme={theme} />
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Formik
                        initialValues={initialValues}
                        validationSchema={registrationSchema}
                        enableReinitialize
                        onSubmit={(values) => onRegister(values)}
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
                                            returnKeyType='next'
                                            onSubmitEditing={() => firstNameRef.current?.focus()}
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
                                    <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                        <TextInput
                                            placeholder='First name...'
                                            value={values.firstName}
                                            ref={firstNameRef}
                                            onChangeText={handleChange('firstName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('firstName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => lastNameRef.current?.focus()}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='firstName'
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
                                            placeholder='Last name...'
                                            value={values.lastName}
                                            ref={lastNameRef}
                                            onChangeText={handleChange('lastName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('lastName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => phoneRef.current?.focus()}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='lastName'
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
                                            placeholder='Phone...'
                                            value={values.phone}
                                            ref={phoneRef}
                                            onChangeText={handleChange('phone')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            onBlur={handleBlur('phone')}
                                            onSubmitEditing={handleSubmit}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
                                            keyboardType='number-pad'
                                            maxLength={10}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='phone'
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
                        Create An Account!
                    </Text>
                }
            </TouchableOpacity>
            <View style={[styles.signIn, isKeyboardOpen && { display: 'none' }]}>
                <Text style={styles[`text${theme}`]}>
                    Already have an account?
                </Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.link, styles[`text${theme}`]]}> Sign in</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default RegistrationScreen;

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
    signIn: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    link: {
        fontWeight: 'bold'
    }
});