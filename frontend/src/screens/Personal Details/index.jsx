import React, { useRef, useContext } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updatePesonalDetails } from '../../redux/actions/user';
import { localhost } from '../../utils/utilities';
import { ThemeContext } from '../../utils/ThemeManager';
import { personalDetailsSchemaV2 } from '../../utils/schemas';
import { darkMode, lightMode } from '../../utils/themes';

// React Native Components
import {
    StyleSheet,
    Platform,
    StatusBar,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    SafeAreaView
} from 'react-native';

const PersonalDetailsScreen = ({ route }) => {
    const { firstName, lastName, phone, id } = route.params;
    const { theme } = useContext(ThemeContext);
    const lastNameRef = useRef(null);
    const phoneRef = useRef(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const initialValues = {
        firstName: firstName,
        lastName: lastName,
        phone: phone
    }

    const onUpdatePersonalDetails = (values) => {
        console.log('hey')
        fetch(`http://${localhost}/update-personal-details?id=${id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalDetails: values
                })
            })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .finally(() => {
                dispatch(updatePesonalDetails(values.firstName, values.lastName, values.phone));
                navigation.goBack();
            });
    }

    return (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Text style={[styles.title, styles[`text${theme}`]]}>Edit Personal Details</Text>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={personalDetailsSchemaV2}
                        enableReinitialize
                        onSubmit={(values) => onUpdatePersonalDetails(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>First Name</Text>
                                    <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                        <TextInput
                                            placeholder='First name...'
                                            value={values.firstName}
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
                                    <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>Last Name</Text>
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
                                    <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>Phone Number</Text>
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
                                            keyboardType='phone-pad'
                                            maxLength={10}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
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
        </SafeAreaView>
    )
}

export default PersonalDetailsScreen;

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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 15
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
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 5
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
    }
});