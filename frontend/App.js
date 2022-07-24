import 'react-native-gesture-handler';
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { I18nManager, LogBox } from "react-native";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { AppNavigator } from './src/components';
import rootReducer from './src/redux/reducers';
import config from './src/utils/config';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
LogBox.ignoreAllLogs();

const store = createStore(rootReducer);

export default function App() {
    return (
        <Provider store={store}>
            <StripeProvider publishableKey={config.PUBLISHABLE_KEY}>
                <AppNavigator />
            </StripeProvider>
        </Provider>
    );
}
