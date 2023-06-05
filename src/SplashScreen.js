import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  Dimensions,
  LogBox,
  Text,
} from 'react-native';
import { fcmService } from '../app/Notification/FCMService';
import { localNotificationService } from '../app/Notification/LocalNotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderNode } from 'react-native-elements/dist/helpers';
import app_version from '../app_version.json';
import LocalConfig from '../LocalConfig';
import sqlService from './sql';
const sql = new sqlService;
LogBox.ignoreLogs(['Reanimated 2']);
export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    fcmService.registerAppWithFCM();
    fcmService.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
    );
    localNotificationService.configure(this.onOpenNotification1);
    if(LocalConfig.IN_DEVELOPMENT){
      sql.deleteallrows()
    }
  }
  closeActivityIndicator = () => {
    AsyncStorage.getItem('user_id').then(value => {
      const API = `${LocalConfig.API_URL}admin/api/store_details.php?userid=${value}`
      fetch(API)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.store_details[0]?.isBlocked == 1) {
            return this.props.navigation.replace('Auth')
          }
          if (
            app_version.android !=
            responseJson.store_details[0].version_code_android &&
            Platform.OS == 'android'
          ) {
            return this.props.navigation.replace('UpdatePage', { confirm: responseJson.store_details[0].confirm });
          } else {
            return AsyncStorage.getItem('user_id').then(value => {
              this.props.navigation.replace(
                value === null ? 'Auth' : 'frontpage',
              );
            });
          }
        });
    })
  };
  onRegister = token => {
    AsyncStorage.setItem('token', token);
    this.closeActivityIndicator();
  };
  onNotification = notify => {
    const options = {
      soundName: 'default',
      playSound: true,
    };
    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options,
    );
  };
  onOpenNotification = async notify => {
    if (notify.data.landing_page == 'order-list') {
      AsyncStorage.getItem('user_id').then(value =>
        this.props.navigation.replace(
          value === null ? 'Auth' : 'OrderHistory2',
          { order_no: notify.data.id },
        ),
      );
    } else if (notify.data.landing_page == 'order-details') {
      AsyncStorage.getItem('user_id').then(value =>
        this.props.navigation.replace(
          value === null ? 'Auth' : 'OrderHistory2',
        ),
      );
    } else {
      AsyncStorage.getItem('user_id').then(value =>
        this.props.navigation.replace(
          value === null ? 'Auth' : 'DrawerNavigatorRoutes',
        ),
      );
    }
  };
  onOpenNotification1 = async notify1 => {
    if (notify1.landing_page == 'order-list') {
      AsyncStorage.getItem('user_id').then(value =>
        this.props.navigation.replace(
          value === null ? 'Auth' : 'OrderHistory2',
          { order_no: notify1.id },
        ),
      );
    } else if (notify1.landing_page == 'order-details') {
      AsyncStorage.getItem('user_id').then(value =>
        this.props.navigation.replace(
          value === null ? 'Auth' : 'OrderHistory2',
        ),
      );
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.logo}
          source={require('../assests/Logo.png')}
          resizeMode="center"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LocalConfig.COLOR.BLACK,
  },
  logo: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
