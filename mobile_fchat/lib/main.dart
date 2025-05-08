import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:mobile_fchat/common/services/http-service.dart';
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
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized(); //Needed for Flutter

await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
);
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
