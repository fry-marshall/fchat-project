import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/views/authentication/authentication.dart';

class HomePage extends StatefulWidget {
  State<HomePage> createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    _requestPermision();

    Future.delayed(Duration(milliseconds: 4000), () {
      Utils.pusherRemove(context, AuthenticationPage());
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Image.asset('assets/logo.png', width: 100)),
    );
  }

  Future<void> _requestPermision() async {
    await FirebaseMessaging.instance.requestPermission();

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print("🔔 Notification en premier plan : ${message.notification?.title}");
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print(
        "📂 L'utilisateur a cliqué sur la notif : ${message.notification?.title}",
      );
    });
  }
}
