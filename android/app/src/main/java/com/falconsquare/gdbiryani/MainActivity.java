package com.falconsquare.mypracto;

import com.facebook.react.ReactInstanceManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.NotificationCompat;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.falconsquare.mypracto.BuildConfig;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  private ReactInstanceManager mReactInstanceManager;
  private ReactRootView mReactRootView;
  @Override
  protected String getMainComponentName() {
    return "Thiyagu Restaurant";
  }

  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //     NotificationChannel notificationChannel = new NotificationChannel("fcm_fallback_notification_channel", "q2hadmin",
  //         NotificationManager.IMPORTANCE_HIGH);
  //     notificationChannel.setShowBadge(true);
  //     notificationChannel.setDescription("");
  //     AudioAttributes att = new AudioAttributes.Builder()
  //         .setUsage(AudioAttributes.USAGE_NOTIFICATION)
  //         .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
  //         .build();
  //     notificationChannel.setSound(
  //         Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName()
  //             + "/raw/q2hsound"),
  //         att);

  //     notificationChannel.enableVibration(false);
  //     notificationChannel.setVibrationPattern(new long[] { 2000, 2000 });
  //     notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
  //     NotificationManager manager = getSystemService(NotificationManager.class);
  //     manager.createNotificationChannel(notificationChannel);
  //   }

  //   super.onCreate(savedInstanceState);

  // }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView
   * is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
