import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/services/notification.service.dart';
import 'package:mobile_fchat/state/blocs/message/message.bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/views/authentication/authentication.dart';
import 'package:mobile_fchat/views/conversations/conversations.dart';

class HomePage extends StatefulWidget {
  State<HomePage> createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    _requestPermision();
  }

  @override
  Widget build(BuildContext context) {
    Future.delayed(Duration(milliseconds: 4000), () async {
      if (await Utils.getValue(key: 'access_token') != null) {
        context.read<UserBloc>().add(GetUserInfosRequested());
        context.read<UserBloc>().add(GetAllUsersInfosRequested());
        context.read<MessageBloc>().add(GetAllUserMessagesRequested());
        String? token = await FirebaseNotificationService().getToken();
        if (token != null) {
          context.read<UserBloc>().add(DeviceTokenRequested(token));
        }
        Utils.pusherRemove(context, ConversationsPage());
      } else {
        Utils.pusherRemove(context, AuthenticationPage());
      }
    });

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
