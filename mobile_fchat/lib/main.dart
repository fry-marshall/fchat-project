import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:mobile_fchat/common/services/firebase.service.dart';
import 'package:mobile_fchat/common/services/http-service.dart';
import 'package:mobile_fchat/firebase_options.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.bloc.dart';
import 'package:mobile_fchat/state/blocs/socket/socket.cubit.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/repositories/auth.repository.dart';
import 'package:mobile_fchat/state/repositories/message.repository.dart';
import 'package:mobile_fchat/state/repositories/user.repository.dart';
import 'package:mobile_fchat/views/authentication/authentication.dart';
import 'package:mobile_fchat/views/home.dart';
import 'package:firebase_core/firebase_core.dart';

final FlutterLocalNotificationsPlugin localNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('📥 BG Notification: ${message.notification?.title}');
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // 🔔 Notification en arrière-plan
  //FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  //await _initLocalNotifications();
  FirebaseService().init();

  await initializeDateFormatting('fr_FR', null);
  await dotenv.load(fileName: ".env.production");
  final httpService = HttpService();
  final authRepository = AuthRepository(httpService: httpService);
  final userRepository = UserRepository(httpService: httpService);
  final messageRepository = MessageRepository(httpService: httpService);
  runApp(
    MultiRepositoryProvider(
      providers: [
        RepositoryProvider(create: (context) => authRepository),
        RepositoryProvider(create: (context) => userRepository),
        RepositoryProvider(create: (context) => messageRepository),
      ], 
      child: MultiBlocProvider(
        providers: [
          BlocProvider(create: (_) => AuthBloc(authRepository: authRepository)),
          BlocProvider(create: (_) => UserBloc(userRepository: userRepository)),
          BlocProvider(create: (_) => MessageBloc(messageRepository: messageRepository)),
          BlocProvider(create: (_){
            var cubit = SocketCubit();
            cubit.initSocket();
            return cubit;
          })
        ], 
        child: MyApp()
      )
    )
  );
}

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      navigatorKey: navigatorKey,
      routes: {
        '/authentification': (context) => AuthenticationPage(),
      },
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color.fromRGBO(50, 133, 210, 1),
        ).copyWith(
          primary: Color.fromRGBO(
            50,
            133,
            210,
            1,
          ),
        ),
      ),
      home: HomePage(),
    );
  }
}


Future<void> _initLocalNotifications() async {
  const AndroidInitializationSettings androidInitSettings =
      AndroidInitializationSettings('@mipmap/ic_launcher');

  final DarwinInitializationSettings iosInitSettings =
      DarwinInitializationSettings();

  final InitializationSettings initSettings = InitializationSettings(
    android: androidInitSettings,
    iOS: iosInitSettings,
  );

  await localNotificationsPlugin.initialize(initSettings);
}