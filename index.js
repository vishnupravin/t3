/**
 * @format
 */
import React from 'react';
import {AppRegistry, TextInput, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {});

Text.defaultProps = {};
Text.defaultProps.maxFontSizeMultiplier = 1.1;

TextInput.defaultProps = {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.1;

AppRegistry.registerComponent(appName, () => App);
