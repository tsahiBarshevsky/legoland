import React, { useState, useRef } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik';

// React Native components
import {
    StyleSheet,
    Platform,
    StatusBar,
    Dimensions,
    Text,
    View,
    ScrollView,
    Button,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';

const { width } = Dimensions.get('screen');

const CheckoutScreen = ({ route }) => {
    const { checkout, user } = route.params;
    const [activeScreen, setActiveScreen] = useState(1);
    const scrollRef = useRef(null);
    const navigation = useNavigation();

    // Text inputs refs
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const streetRef = useRef(null);
    const houseRef = useRef(null);
    const floorRef = useRef(null);

    const nextScreen = () => {
        setActiveScreen(prevState => prevState + 1);
        scrollRef.current?.scrollTo({ x: width * activeScreen });
    }

    const previousScreen = () => {
        setActiveScreen(prevState => prevState - 1);
        scrollRef.current?.scrollTo({ x: width * (activeScreen - 2) });
    }

    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                <Progress.Bar
                    progress={activeScreen / 4}
                    width={null}
                    height={10}
                    color={'black'}
                    unfilledColor={'rgba(0, 0, 0, 0.25)'}
                    borderWidth={0}
                    animationType="timing"
                    borderRadius={10}
                    animationConfig={{ duration: 400 }}
                />
            </View>
            <ScrollView
                horizontal
                ref={scrollRef}
                decelerationRate="normal"
                snapToInterval={width}
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                pagingEnabled
                style={{ width: width }}
                scrollEnabled={false}
                nestedScrollEnabled
            >
                <View style={styles.screen}>
                    <Button title='next' onPress={nextScreen} />
                    <Text style={styles.title}>Personal details</Text>
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
                                initialValues={{
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email,
                                    phone: user.phone
                                }}
                                enableReinitialize
                                onSubmit={(values) => {
                                    console.log(values);
                                    nextScreen();
                                }}
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
                                                    onSubmitEditing={() => emailRef.current?.focus()}
                                                />
                                            </View>
                                            <View style={styles.textInputWrapper}>
                                                <TextInput
                                                    placeholder='Email...'
                                                    value={values.email}
                                                    ref={emailRef}
                                                    onChangeText={handleChange('email')}
                                                    style={styles.textInput}
                                                    underlineColorAndroid="transparent"
                                                    // placeholderTextColor={placeholder}
                                                    // selectionColor={placeholder}
                                                    blurOnSubmit={false}
                                                    onBlur={handleBlur('email')}
                                                    keyboardType='email-address'
                                                    returnKeyType='next'
                                                    onSubmitEditing={() => phoneRef.current?.focus()}
                                                />
                                            </View>
                                            <View style={styles.textInputWrapper}>
                                                <TextInput
                                                    placeholder='Phone...'
                                                    value={values.phone}
                                                    ref={phoneRef}
                                                    onChangeText={handleChange('phone')}
                                                    style={styles.textInput}
                                                    underlineColorAndroid="transparent"
                                                    // placeholderTextColor={placeholder}
                                                    // selectionColor={placeholder}
                                                    onBlur={handleBlur('phone')}
                                                    onSubmitEditing={handleSubmit}
                                                    keyboardType='phone-pad'
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
                <View style={styles.screen}>
                    <Button title='prev' onPress={previousScreen} />
                    <Button title='next' onPress={nextScreen} />
                    <Text style={styles.title}>Shipping</Text>
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 15 }}
                    >
                        <KeyboardAvoidingView
                            enabled
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                        >
                            {Object.keys(user.addresses).length === 0 &&
                                <Formik
                                    initialValues={{ city: '', street: '', house: '', floor: '' }}
                                    enableReinitialize
                                    onSubmit={(values) => {
                                        console.log(values);
                                        nextScreen();
                                    }}
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
                                                    />
                                                </View>
                                                <View style={styles.textInputWrapper}>
                                                    <TextInput
                                                        placeholder='Floor number...'
                                                        value={values.floor}
                                                        ref={floorRef}
                                                        onChangeText={handleChange('flor')}
                                                        style={styles.textInput}
                                                        underlineColorAndroid="transparent"
                                                        // placeholderTextColor={placeholder}
                                                        // selectionColor={placeholder}
                                                        onBlur={handleBlur('flor')}
                                                        onSubmitEditing={handleSubmit}
                                                        keyboardType='numeric'
                                                    />
                                                </View>
                                            </View>
                                        )
                                    }}
                                </Formik>
                            }
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
                <View style={styles.screen}>
                    <Button title='prev' onPress={previousScreen} />
                    <Button title='next' onPress={nextScreen} />
                    <Text style={styles.title}>Payment</Text>
                </View>
                <View style={styles.screen}>
                    <Button title='prev' onPress={previousScreen} />
                    <Button title='done' onPress={() => navigation.popToTop()} />
                    <Text style={styles.title}>Confirmation</Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5'
    },
    progressBar: {
        marginVertical: 20,
        paddingHorizontal: 15
    },
    screen: {
        width: width,
        paddingHorizontal: 15,
        backgroundColor: 'green'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});


// city: user.addresses.primary.city,
// street: user.addresses.primary.street,
// house: user.addresses.primary.house,
// floor: user.addresses.primary.floor