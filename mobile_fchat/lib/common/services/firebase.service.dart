import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:mobile_fchat/main.dart';

class FirebaseService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<void> init() async {
    await _requestPermissions();
    print("yooo");
await Future.delayed(Duration(seconds: 1));
    String? apnsToken = await _messaging.getAPNSToken();
print('📲 APNs Token: $apnsToken');

    // Token FCM
    String? token = await _messaging.getToken();
    print("📱 FCM Token: $token");

    // Si app fermée et notification cliquée
    FirebaseMessaging.instance.getInitialMessage().then((message) {
      if (message != null) _handleMessage(message);
    });

    // App en arrière-plan
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessage);

    // App en avant-plan
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('🔔 Foreground notification: ${message.notification?.title}');
      _showLocalNotification(message);
    });
  }

  Future<void> _requestPermissions() async {
    NotificationSettings settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    print('🔐 Auth status: ${settings.authorizationStatus}');
  }

  void _handleMessage(RemoteMessage message) {
    // Tu peux rediriger vers une page spécifique ici
    print("📲 Notification ouverte : ${message.data}");
  }

  void _showLocalNotification(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'default_channel',
      'Default',
      importance: Importance.max,
      priority: Priority.high,
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(),
    );

    localNotificationsPlugin.show(
      notification.hashCode,
      notification.title,
      notification.body,
      platformDetails,
    );
  }
}
