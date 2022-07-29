import 'react-native-gesture-handler';
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { I18nManager, LogBox } from "react-native";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { AppNavigator } from './src/components';
import { ThemeProvider } from './src/utils/ThemeManager';
import { toastConfig } from './src/utils/toastConfig';
import rootReducer from './src/redux/reducers';
import config from './src/utils/config';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
LogBox.ignoreAllLogs();

const store = createStore(rootReducer);

export default function App() {
    const [loaded] = useFonts({
        SquarePeg: require('./assets/Fonts/SquarePeg-Regular.ttf'),
        BebasNeue: require('./assets/Fonts/BebasNeue-Regular.ttf')
    });

    if (!loaded)
        return null;

    return (
        <Provider store={store}>
            <StripeProvider publishableKey={config.PUBLISHABLE_KEY}>
                <ThemeProvider>
                    <AppNavigator />
                </ThemeProvider>
            </StripeProvider>
            <Toast config={toastConfig} />
        </Provider>
    );
}
