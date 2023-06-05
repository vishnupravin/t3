import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localNotificationService} from './LocalNotificationService';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // authStatus
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {}
  } else {
  }
};

export const NotificationListner = async () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {});
  messaging().onMessage(async remoteMessage => {
    // localNotificationService.configure()
    // localNotificationService.buildAndroidNotification()
    // localNotificationService.showNotification()
    // localNotificationService.unregister()
    // //  app closed noti
    //
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
      }
    });
};

export const BackgroundMessageHandler = async () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().setBackgroundMessageHandler(remoteMessage => {});
  messaging().onMessage(async remoteMessage => {
    // Notification receive app closed
    //
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
      }
    });
};
