import 'react-native-gesture-handler';
import React from 'react';
import { I18nManager, LogBox } from "react-native";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { AppNavigator } from './src/components';
import rootReducer from './src/redux/reducers';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
LogBox.ignoreAllLogs();

const store = createStore(rootReducer);

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    );
}
