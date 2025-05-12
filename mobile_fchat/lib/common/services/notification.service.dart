import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class LocalNotificationService {
  final FlutterLocalNotificationsPlugin notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  Future<void> init() async {
    AndroidInitializationSettings androidInitializationSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    DarwinInitializationSettings initializationSettingsIOS =
        DarwinInitializationSettings(
          requestAlertPermission: true,
          requestBadgePermission: true,
          requestSoundPermission: true,
        );

    InitializationSettings initializationSettings = InitializationSettings(
      android: androidInitializationSettings,
      iOS: initializationSettingsIOS,
    );

    await notificationsPlugin.initialize(initializationSettings);
  }

  notificationDetails() {
    return const NotificationDetails(
      android: AndroidNotificationDetails(
        'channelId',
        'channelName',
        importance: Importance.max,
      ),
      iOS: DarwinNotificationDetails(),
    );
  }

  Future showNotification(
    String? conversation_id,
    String userName,
    String content,
  ) async {
    return notificationsPlugin.show(
      0,
      userName,
      content,
      await notificationDetails(),
    );
  }
}

class FirebaseNotificationService {
  FirebaseMessaging messaging = FirebaseMessaging.instance;

  static AuthorizationStatus? status;

  Future<void> requestPermision() async {
    NotificationSettings settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    status = settings.authorizationStatus;
  }

  Future<String?> getToken() async {
    if (status == AuthorizationStatus.authorized) {
      print('Notifications autorisées');

      var token = await messaging.getToken();
      print("FCM Token: $token");
      return token;
    }
    return null;
  }

  void handleNotifications() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      print('Message data: ${message.notification?.title.toString()}');
      print('Message data: ${message.notification?.body.toString()}');

      if (message.notification != null) {
        print('Message also contained a notification: ${message.notification}');
      }
      LocalNotificationService().showNotification(
        '',
        message.notification?.title ?? '',
        message.notification?.body ?? '',
      );
      String? conversationId = message.data['conversation_id'];
      if (conversationId != null) {}
    });

    FirebaseMessaging.onBackgroundMessage((RemoteMessage message) async {
      await Firebase.initializeApp();

      print('Handling a background message: ${message.messageId}');
      print('Message title: ${message.notification?.title}');
      print('Message body: ${message.notification?.body}');
    });
  }
}
