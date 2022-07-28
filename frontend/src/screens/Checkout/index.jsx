import React, { useState, useRef, useContext } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native'
import { Formik, ErrorMessage } from 'formik';
import update from 'immutability-helper';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { Checkbox } from '../../components';
import { localhost } from '../../utils/utilities';
import { updateAddresses } from '../../redux/actions/user';
import { addNewOrder } from '../../redux/actions/orders';
import { emptyCart } from '../../redux/actions/cart';
import { updateStock } from '../../redux/actions/products';
import { authentication } from '../../utils/firebase';
import { ThemeContext } from '../../utils/ThemeManager';
import { personalDetailsSchema, addressSchema } from '../../utils/schemas';

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
    Alert,
    SafeAreaView,
    FlatList,
    Image,
    ToastAndroid
} from 'react-native';
import { darkMode, lightMode } from '../../utils/themes';
import { Entypo } from '@expo/vector-icons';

const { width } = Dimensions.get('screen');

const CheckoutScreen = ({ route }) => {
    const { checkout, cart, user } = route.params;
    const { theme } = useContext(ThemeContext);
    const [personalDetails, setPersonalDetails] = useState({});
    const [shippingDetails, setShippingDetails] = useState(
        user.addresses ? user.addresses.primary : {}
    );
    const [paymentConfirmation, setPaymentConfirmation] = useState({});
    const [activeScreen, setActiveScreen] = useState(1);
    const [saveAddress, setSaveAddress] = useState(false);
    const [useAddress, setUseAddress] = useState({
        primary: true,
        secondary: false
    });
    const [cardDetails, setCardDetails] = useState();
    const products = useSelector(state => state.products);
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

    const getImageLink = (item) => {
        return products.find((e) => e.catalogNumber === item.catalogNumber).image;
    }

    const nextScreen = () => {
        setActiveScreen(prevState => prevState + 1);
        scrollRef.current?.scrollTo({ x: width * activeScreen });
    }

    const previousScreen = () => {
        setActiveScreen(prevState => prevState - 1);
        scrollRef.current?.scrollTo({ x: width * (activeScreen - 2) });
    }

    const onChangeAddress = (type, address) => {
        setShippingDetails(address);
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

    const fetchPaymentIntentClientSecret = async () => {
        const response = await fetch(`http://${localhost}/create-payment-intent?amount=${checkout}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { clientSecret, error } = await response.json();
        return { clientSecret, error };
    }

    const handlePay = async () => {
        console.log('hey')
        if (!cardDetails?.complete) {
            ToastAndroid.show('Please enter Complete card details', ToastAndroid.LONG);
            return;
        }
        const billingDetails = { email: authentication.currentUser.email };
        try {
            const { clientSecret, error } = await fetchPaymentIntentClientSecret();
            if (error) {
                console.log("Unable to process payment");
            } else {
                const { paymentIntent, error } = await confirmPayment(clientSecret, {
                    type: "Card",
                    billingDetails: billingDetails,
                });
                if (error) {
                    ToastAndroid.show(`Payment Confirmation Error ${error.message}`, ToastAndroid.LONG);
                } else if (paymentIntent) {
                    console.log("Payment Successful");
                    return paymentIntent;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const onPurchase = () => {
        const payment = handlePay();
        payment.then((paymentConfirmation) => {
            const newOrder = {
                date: new Date(),
                owner: authentication.currentUser.email,
                products: cart.products,
                sum: checkout,
                address: shippingDetails,
                firstName: personalDetails.firstName,
                lastName: personalDetails.lastName,
                phone: personalDetails.phone,
                paymentConfirmation: paymentConfirmation
            };
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
                    .catch((error) => console.log(error.message))
                    .finally(() => dispatch(updateAddresses(newOrder.address, 'primary')));
            fetch(`http://${localhost}/add-new-order`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newOrder)
                })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res.message);
                    newOrder._id = res.orderId;
                    newOrder.orderNumber = res.orderNumber;
                    dispatch(addNewOrder(newOrder));
                    cart.products.forEach((item) => {
                        const index = products.findIndex((p) => p.catalogNumber === item.catalogNumber);
                        fetch(`http://${localhost}/update-product-stock`,
                            {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    catalogNumber: item.catalogNumber,
                                    currentStock: products[index].stock,
                                    amount: item.amount
                                })
                            })
                            .then((res) => res.json())
                            .then((res) => console.log(res))
                            .finally(() => {
                                dispatch(updateStock(index, item.amount));
                            });
                    });
                    fetch(`http://${localhost}/empty-cart?id=${cart._id}`,
                        {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                        .then((res) => res.json())
                        .then((res) => console.log(res))
                        .finally(() => {
                            dispatch(emptyCart());
                        });
                })
                .catch((error) => console.log(error.message))
                .finally(() => navigation.popToTop());
        });
    }

    const Separator = () => (
        <View style={[styles.separator, styles[`separator${theme}`]]} />
    )

    return (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            <View style={styles.progressBar}>
                <Progress.Bar
                    progress={activeScreen / 3}
                    width={null}
                    height={10}
                    color={lightMode.primary}
                    unfilledColor={'rgba(95, 122, 219, 0.25)'}
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
                    <Text style={[styles.title, styles[`text${theme}`]]}>Personal details</Text>
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
                                validationSchema={personalDetailsSchema}
                                enableReinitialize
                                onSubmit={(values) => {
                                    setPersonalDetails(update(personalDetails, {
                                        $set: {
                                            firstName: values.firstName,
                                            lastName: values.lastName,
                                            email: values.email,
                                            phone: values.phone
                                        }
                                    }));
                                    nextScreen();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                                    return (
                                        <View>
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
                                                    onSubmitEditing={() => emailRef.current?.focus()}
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
                                            <Text style={[styles.textInputTitle, styles[`text${theme}`]]}>Email</Text>
                                            <View style={[styles.textInputWrapper, styles[`textInputWrapper${theme}`]]}>
                                                <TextInput
                                                    placeholder='Email...'
                                                    value={values.email}
                                                    ref={emailRef}
                                                    onChangeText={handleChange('email')}
                                                    underlineColorAndroid="transparent"
                                                    placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                    selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                    blurOnSubmit={false}
                                                    onBlur={handleBlur('email')}
                                                    keyboardType='email-address'
                                                    returnKeyType='next'
                                                    onSubmitEditing={() => phoneRef.current?.focus()}
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
                                            <TouchableOpacity
                                                onPress={handleSubmit}
                                            // style={styles.button}
                                            >
                                                <Text>Next</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            </Formik>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
                {/* Shipping screen */}
                <View style={styles.screen}>
                    <Text style={[styles.title, styles[`text${theme}`]]}>Shipping</Text>
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
                                    validationSchema={addressSchema}
                                    enableReinitialize
                                    onSubmit={(values) => {
                                        setShippingDetails(update(shippingDetails, {
                                            $set: { values }
                                        }));
                                        nextScreen();
                                    }}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                                        return (
                                            <View>
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
                                                <Checkbox
                                                    checked={saveAddress}
                                                    setChecked={setSaveAddress}
                                                    caption='Save as primary address'
                                                    theme={theme}
                                                />
                                                <TouchableOpacity
                                                    onPress={handleSubmit}
                                                // style={styles.button}
                                                >
                                                    <Text>Next</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={previousScreen}
                                                // style={styles.button}
                                                >
                                                    <Text>Previous</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                </Formik>
                            </KeyboardAvoidingView>
                        </ScrollView>
                        :
                        <View>
                            <Text style={styles[`text${theme}`]}>Select address</Text>
                            <View style={styles.options}>
                                <TouchableOpacity
                                    onPress={() => onChangeAddress('primary', user.addresses.primary)}
                                    style={[styles.addressButton, useAddress.primary ? styles.checked : styles.unchecked]}
                                    activeOpacity={1}
                                >
                                    <View style={[styles.circle, useAddress.primary ? styles.circleCheck : styles.circleUncheck]}>
                                        {useAddress.primary && <Entypo name='check' size={15} color='white' />}
                                    </View>
                                    <Text style={[styles[`text${theme}`], { fontWeight: 'bold' }]}>Primary</Text>
                                </TouchableOpacity>
                                {user.addresses.secondary &&
                                    <TouchableOpacity
                                        onPress={() => onChangeAddress('secondary', user.addresses.secondary)}
                                        style={[styles.addressButton, useAddress.secondary ? styles.checked : styles.unchecked]}
                                        activeOpacity={1}
                                    >
                                        <View style={[styles.circle, useAddress.secondary ? styles.circleCheck : styles.circleUncheck]}>
                                            {useAddress.secondary && <Entypo name='check' size={15} color='white' />}
                                        </View>
                                        <Text style={[styles[`text${theme}`], { fontWeight: 'bold' }]}>Secondary</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            {useAddress.primary &&
                                <>
                                    <Text style={styles[`text${theme}`]}>{user.addresses.primary.street}, {user.addresses.primary.city}</Text>
                                    <Text style={styles[`text${theme}`]}>Apartment {user.addresses.primary.house}</Text>
                                    <Text style={styles[`text${theme}`]}>{user.addresses.primary.floor} Floor</Text>
                                </>
                            }
                            {useAddress.secondary &&
                                <>
                                    <Text style={styles[`text${theme}`]}>{user.addresses.secondary.street}, {user.addresses.secondary.city}</Text>
                                    <Text style={styles[`text${theme}`]}>Apartment {user.addresses.secondary.house}</Text>
                                    <Text style={styles[`text${theme}`]}>{user.addresses.secondary.floor} Floor</Text>
                                </>
                            }
                            <TouchableOpacity
                                onPress={nextScreen}
                            // style={styles.button}
                            >
                                <Text>Next</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={previousScreen}
                            // style={styles.button}
                            >
                                <Text>Previous</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {/* Payment and confirmation screen */}
                <View style={styles.screen}>
                    <Text style={[styles.title, styles[`text${theme}`]]}>Payment And Confirmation</Text>
                    <Text style={[styles.subtitle, styles[`text${theme}`]]}>Order summary</Text>
                    <FlatList
                        data={cart.products}
                        keyExtractor={(item) => item.catalogNumber}
                        ItemSeparatorComponent={Separator}
                        style={{ marginBottom: 10 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.summaryBox}>
                                    <View style={[styles.imageWrapper, styles[`imageWrapper${theme}`]]}>
                                        <Image
                                            source={{ uri: getImageLink(item) }}
                                            resizeMode='stretch'
                                            style={styles.image}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.name, styles[`text${theme}`]]}>{item.name}</Text>
                                        <Text style={styles[`text${theme}`]}>Quantity: {item.amount}</Text>
                                        <Text style={styles[`text${theme}`]}>Price: {item.sum}₪</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    <Text style={[styles.subtitle, styles[`text${theme}`]]}>Credit card details</Text>
                    <CardField
                        postalCodeEnabled
                        placeholder={{ number: "4242 4242 4242 4242" }}
                        cardStyle={styles[`card${theme}`]}
                        style={styles.cardContainer}
                        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
                    />
                    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={onPurchase} disabled={loading}>
                        <Text style={!loading ? { color: 'black' } : { color: 'red' }}>Place your order</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    progressBar: {
        marginVertical: 20,
        paddingHorizontal: 15
    },
    screen: {
        width: width,
        paddingHorizontal: 15
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'capitalize'
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
    button: {
        position: 'absolute',
        bottom: 0
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingBottom: 15
    },
    addressButton: {
        width: '40%',
        height: 45,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10,
        elevation: 1,
        paddingHorizontal: 10
    },
    checked: {
        borderColor: lightMode.primary
    },
    unchecked: {
        borderColor: '#acacac'
    },
    circle: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    circleCheck: {
        backgroundColor: lightMode.primary
    },
    circleUncheck: {
        borderWidth: 1,
        borderColor: '#acacac'
    },
    subtitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10
    },
    cardLight: {
        textColor: lightMode.text,
        backgroundColor: lightMode.boxes,
        borderRadius: 50,
        fontSize: 16
    },
    cardDark: {
        textColor: darkMode.text,
        backgroundColor: darkMode.boxes,
        borderRadius: 50,
        fontSize: 16
    },
    cardContainer: {
        height: 45,
        marginBottom: 10,
    },
    summaryBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 100,
        marginRight: 15,
        borderRadius: 15,
        paddingVertical: 5
    },
    imageWrapperLight: {
        backgroundColor: lightMode.boxes
    },
    imageWrapperDark: {
        backgroundColor: darkMode.boxes
    },
    image: {
        flex: 1,
        height: undefined,
        width: '100%',
        aspectRatio: 1
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 2,
        flexShrink: 1
    },
    separator: {
        height: 1,
        width: '100%',
        borderRadius: 2,
        marginVertical: 10
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
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
});