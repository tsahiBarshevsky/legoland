import React, { useState, useRef } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik';
import update from 'immutability-helper';
import { useDispatch } from 'react-redux';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { Checkbox } from '../../components';
import { localhost } from '../../utils/utilities';
import { updateAddresses } from '../../redux/actions/user';
import { authentication } from '../../utils/firebase';

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
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';

const { width } = Dimensions.get('screen');

const CheckoutScreen = ({ route }) => {
    const { checkout, user } = route.params;
    const [newOrder, setNewOrder] = useState({});
    const [activeScreen, setActiveScreen] = useState(1);
    const [saveAddress, setSaveAddress] = useState(false);
    const [useAddress, setUseAddress] = useState({
        primary: true,
        secondary: false
    });
    const [cardDetails, setCardDetails] = useState();
    const [paymentIntent, setPaymentIntent] = useState({});
    const { confirmPayment, loading } = useConfirmPayment();
    const scrollRef = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

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

    const onChangeAddress = (type) => {
        if (type === 'primary')
            setUseAddress(update(useAddress, {
                $set: {
                    primary: true,
                    secondary: false
                }
            }));
        else
            setUseAddress(update(useAddress, {
                $set: {
                    primary: false,
                    secondary: true
                }
            }));
    }

    const onPurchase = () => {
        if (saveAddress)
            fetch(`http://${localhost}/update-addresses?id=${user._id}&type=primary`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address: newOrder.address
                    })
                })
                .then((res) => res.json())
                .then((res) => console.log(res))
                .finally(() => dispatch(updateAddresses(newOrder.address, 'primary')));
        if (useAddress.primary)
            console.log('Chosen address:', user.addresses.primary);
        else
            console.log('Chosen address:', user.addresses.secondary);
        navigation.popToTop();
    }

    const fetchPaymentIntentClientSecret = async () => {
        const response = await fetch(`http://${localhost}/create-payment-intent?amount=${checkout}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { clientSecret, error } = await response.json();
        return { clientSecret, error };
    };

    const handlePay = async () => {
        console.log('hey')
        //1.Gather the customer's billing information (e.g., email)
        if (!cardDetails?.complete) {
            Alert.alert("Please enter Complete card details and Email");
            return;
        }
        const billingDetails = {
            email: authentication.currentUser.email,
        };
        //2.Fetch the intent client secret from the backend
        try {
            const { clientSecret, error } = await fetchPaymentIntentClientSecret();
            //2. confirm the payment
            if (error) {
                console.log("Unable to process payment");
            } else {
                const { paymentIntent, error } = await confirmPayment(clientSecret, {
                    type: "Card",
                    billingDetails: billingDetails,
                });
                if (error) {
                    alert(`Payment Confirmation Error ${error.message}`);
                } else if (paymentIntent) {
                    alert("Payment Successful");
                    setPaymentIntent(paymentIntent);
                }
            }
        } catch (e) {
            console.log(e);
        }
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
                {/* Personal details screen */}
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
                {/* Shipping screen */}
                <View style={styles.screen}>
                    <Button title='prev' onPress={previousScreen} />
                    <Button title='next' onPress={nextScreen} />
                    <Text style={styles.title}>Shipping</Text>
                    {Object.keys(user.addresses).length === 0 ?
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
                                    onSubmit={(values) => {
                                        setNewOrder(update(newOrder, {
                                            $set: {
                                                address: values
                                            }
                                        }));
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
                                <Checkbox
                                    checked={saveAddress}
                                    setChecked={setSaveAddress}
                                    caption='Save as primary address'
                                />
                            </KeyboardAvoidingView>
                        </ScrollView>
                        :
                        <View>
                            <Text>Select address</Text>
                            <View style={styles.options}>
                                <TouchableOpacity onPress={() => onChangeAddress('primary')}>
                                    <Text>Primary</Text>
                                </TouchableOpacity>
                                {user.addresses.secondary &&
                                    <TouchableOpacity onPress={() => onChangeAddress('secondary')}>
                                        <Text>Secondary</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            {useAddress.primary &&
                                <>
                                    <Text>{user.addresses.primary.street}, {user.addresses.primary.city}</Text>
                                    <Text>Apartment {user.addresses.primary.house}</Text>
                                    <Text>{user.addresses.primary.floor} Floor</Text>
                                </>
                            }
                            {useAddress.secondary &&
                                <>
                                    <Text>{user.addresses.secondary.street}, {user.addresses.secondary.city}</Text>
                                    <Text>Apartment {user.addresses.secondary.house}</Text>
                                    <Text>{user.addresses.secondary.floor} Floor</Text>
                                </>
                            }
                        </View>
                    }
                </View>
                {/* Payment screen */}
                <View style={styles.screen}>
                    <Button title='prev' onPress={previousScreen} />
                    <Button title='next' onPress={nextScreen} />
                    <Text style={styles.title}>Payment</Text>
                    <CardField
                        postalCodeEnabled
                        placeholder={{ number: "4242 4242 4242 4242" }}
                        cardStyle={styles.card}
                        style={styles.cardContainer}
                        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
                    />
                    <TouchableOpacity onPress={handlePay} disabled={loading}>
                        <Text style={!loading ? { color: 'black' } : { color: 'red' }}>Pay</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.screen}>
                    <Button title='prev' onPress={previousScreen} />
                    <Button title='done' onPress={onPurchase} />
                    <Text style={styles.title}>Confirmation</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const initialValues = {
    city: '',
    street: '',
    house: '',
    floor: ''
};

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
        fontWeight: 'bold',
        marginBottom: 10
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10
    },
    card: {
        backgroundColor: '#efefef',
        borderRadius: 10,
        fontSize: 16
    },
    cardContainer: {
        height: 50,
        marginVertical: 30,
    }
});