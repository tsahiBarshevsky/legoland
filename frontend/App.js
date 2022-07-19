import 'react-native-gesture-handler';
import React from 'react';
import { I18nManager, LogBox } from "react-native";
import { AppNavigator } from './src/components';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
LogBox.ignoreAllLogs();

export default function App() {
    return (
        <AppNavigator />
    );
}
