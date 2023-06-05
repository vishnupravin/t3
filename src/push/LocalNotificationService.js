import PushNotification, {Importance} from 'react-native-push-notification';

class LocalNotificationService {
  configure = onOpenNotification1 => {
    PushNotification.configure({
      onRegister: function (token) {},
      onNotification: function (notification) {
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        const noti = {notification: notification};
        onOpenNotification1(noti);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  unregister = () => {
    PushNotification.unregister();
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: false,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || false,
      soundName: 'q2hsound',
      ignoreInForeground: false,
      importance: Importance.HIGH,
      invokeApp: true,
      allowWhileIdle: true,
      priority: 'high',
      visibility: 'public',
      data: data,
    };
  };
  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      ...this.buildAndroidNotification(id, title, message, data, options),
      title: title || '',
      message: message || '',
      userInteraction: true, // BOOLEAN : If notification was opened by the user from notification
      channelId: 'fcm_fallback_notification_channel',
      playSound: true,
      soundName: 'q2hsound',
      playSound: options.playSound || true,
      ignoreInForeground: false,
      importance: Importance.HIGH,
      invokeApp: true,
      allowWhileIdle: true,
      priority: 'high',
      visibility: 'public',
      badge: true,
    });
  };

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  removeDeliveredNotificationByID = notificationId => {
    PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  };

  // applicationBadge = () => {
  //     // PushNotification.setApplicationIconBadgeNumber(2);
  //     // const ShortcutBadger = NativeModules.ShortcutBadger;
  //     // let count = 1;
  //     // ShortcutBadger.applyCount(count);
  // }
}

export const localNotificationService = new LocalNotificationService();
