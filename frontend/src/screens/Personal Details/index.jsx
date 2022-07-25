import React, { useRef } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updatePesonalDetails } from '../../redux/actions/user';
import { localhost } from '../../utils/utilities';

const PersonalDetailsScreen = ({ route }) => {
    const { firstName, lastName, phone, id } = route.params;
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
        <View style={styles.container}>
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
                        enableReinitialize
                        onSubmit={(values) => onUpdatePersonalDetails(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='First name...'
                                            value={values.firstName}
                                            onChangeText={handleChange('firstName')}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={placeholder}
                                            // selectionColor={placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('firstName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => lastNameRef.current?.focus()}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Last name...'
                                            value={values.lastName}
                                            ref={lastNameRef}
                                            onChangeText={handleChange('lastName')}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={placeholder}
                                            // selectionColor={placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('lastName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => phoneRef.current?.focus()}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Phone number...'
                                            value={values.phone}
                                            ref={phoneRef}
                                            onChangeText={handleChange('phone')}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={placeholder}
                                            // selectionColor={placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('phone')}
                                            keyboardType='numeric'
                                            onSubmitEditing={handleSubmit}
                                            maxLength={10}
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default PersonalDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    }
});