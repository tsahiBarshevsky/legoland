import React, { useRef } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateAddresses } from '../../redux/actions/user';
import { localhost } from '../../utils/utilities';

const AddressScreen = ({ route }) => {
    const { type, user } = route.params;
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
                        onSubmit={(values) => onUpdateAddresses(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='City...'
                                            value={values.city}
                                            onChangeText={handleChange('city')}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={placeholder}
                                            // selectionColor={placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('city')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => streetRef.current?.focus()}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Street...'
                                            value={values.street}
                                            ref={streetRef}
                                            onChangeText={handleChange('street')}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={placeholder}
                                            // selectionColor={placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('street')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => houseRef.current?.focus()}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='House...'
                                            value={values.house}
                                            ref={houseRef}
                                            onChangeText={handleChange('house')}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={placeholder}
                                            // selectionColor={placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('house')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => floorRef.current?.focus()}
                                            keyboardType='numeric'
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Floor number...'
                                            value={values.floor}
                                            ref={floorRef}
                                            onChangeText={handleChange('floor')}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={placeholder}
                                            // selectionColor={placeholder}
                                            onBlur={handleBlur('floor')}
                                            onSubmitEditing={handleSubmit}
                                            keyboardType='numeric'
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

export default AddressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15
    }
});