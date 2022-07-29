import React, { useRef, useContext } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import { Formik, ErrorMessage } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateAddresses } from '../../redux/actions/user';
import { localhost } from '../../utils/utilities';
import { ThemeContext } from '../../utils/ThemeManager';
import { addressSchema } from '../../utils/schemas';
import { darkMode, lightMode } from '../../utils/themes';

const AddressScreen = ({ route }) => {
    const { type, action, user } = route.params;
    const { theme } = useContext(ThemeContext);
    const streetRef = useRef(null);
    const houseRef = useRef(null);
    const floorRef = useRef(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const initialValues = type === 'primary' ? (
        user.addresses.primary ? {
            city: user.addresses.primary.city,
            street: user.addresses.primary.street,
            house: user.addresses.primary.house,
            floor: user.addresses.primary.floor
        }
            :
            {
                city: '',
                street: '',
                house: '',
                floor: ''
            }
    ) : (
        user.addresses.secondary ? {
            city: user.addresses.secondary.city,
            street: user.addresses.secondary.street,
            house: user.addresses.secondary.house,
            floor: user.addresses.secondary.floor
        }
            :
            {
                city: '',
                street: '',
                house: '',
                floor: ''
            }
    );

    const onUpdateAddresses = (address) => {
        fetch(`http://${localhost}/update-addresses?id=${user._id}&type=${type}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: address
                })
            })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .finally(() => {
                dispatch(updateAddresses(address, type));
                navigation.goBack();
            });
    }

    return (
        <View style={[styles.container, styles[`container${theme}`]]}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Text style={[styles.title, styles[`text${theme}`]]}>
                        {action === 'adding' ? `Add ${type} Address` : `Edit ${type} Address`}
                    </Text>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={addressSchema}
                        enableReinitialize
                        onSubmit={(values) => onUpdateAddresses(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>City</Text>
                                    <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                        <TextInput
                                            placeholder='Which city do you live?'
                                            value={values.city}
                                            onChangeText={handleChange('city')}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('city')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => streetRef.current?.focus()}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='city'
                                        render={(message) => {
                                            return (
                                                <View style={styles.errorContainer}>
                                                    <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color='#b71c1c' />
                                                    <Text style={styles.error}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>Street</Text>
                                    <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                        <TextInput
                                            placeholder="What's your street?"
                                            value={values.street}
                                            ref={streetRef}
                                            onChangeText={handleChange('street')}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('street')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => houseRef.current?.focus()}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='street'
                                        render={(message) => {
                                            return (
                                                <View style={styles.errorContainer}>
                                                    <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color='#b71c1c' />
                                                    <Text style={styles.error}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>House Number</Text>
                                    <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                        <TextInput
                                            placeholder="What's your house number?"
                                            value={values.house}
                                            ref={houseRef}
                                            onChangeText={handleChange('house')}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('house')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => floorRef.current?.focus()}
                                            keyboardType='numeric'
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='house'
                                        render={(message) => {
                                            return (
                                                <View style={styles.errorContainer}>
                                                    <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color='#b71c1c' />
                                                    <Text style={styles.error}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>Floor number</Text>
                                    <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                        <TextInput
                                            placeholder='Which floor do you live?'
                                            value={values.floor}
                                            ref={floorRef}
                                            onChangeText={handleChange('floor')}
                                            style={[styles.textInput, styles[`textInput${theme}`]]}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            onBlur={handleBlur('floor')}
                                            onSubmitEditing={handleSubmit}
                                            keyboardType='numeric'
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='floor'
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
        </View>
    )
}

export default AddressScreen;

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
        textTransform: 'capitalize',
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