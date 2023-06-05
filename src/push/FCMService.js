import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {localNotificationService} from './LocalNotificationService';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled();
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // User has permission
          this.getToken(onRegister);
        } else {
          // User don't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {});
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
        }
      })
      .catch(error => {});
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {});
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {});
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When Application Running on Background
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage;
        onOpenNotification(notification);
      }
    });

    //When Application open from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = remoteMessage;
          localNotificationService.cancelAllLocalNotifications();
          onOpenNotification(notification);
        }
      });

    //Forground state message
    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data;
        } else {
          notification = remoteMessage;
        }

        onNotification(notification);
      }
    });

    // Triggered when have new Token
    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };

  stopAlarmRing = async () => {
    if (Platform.OS != 'ios') {
      await messaging().stopAlarmRing();
    }
  };
}

export const fcmService = new FCMService();
