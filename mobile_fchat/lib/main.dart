import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:mobile_fchat/common/services/http-service.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/repositories/auth.repository.dart';
import 'package:mobile_fchat/state/repositories/user.repository.dart';
import 'package:mobile_fchat/views/home.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized(); //Needed for Flutter
  await initializeDateFormatting('fr_FR', null);
  await dotenv.load(fileName: ".env.production");
  final httpService = HttpService();
  final authRepository = AuthRepository(httpService: httpService);
  final userRepository = UserRepository(httpService: httpService);
  runApp(
    MultiRepositoryProvider(
      providers: [
        RepositoryProvider(create: (context) => authRepository),
        RepositoryProvider(create: (context) => userRepository),
      ], 
      child: MultiBlocProvider(
        providers: [
          BlocProvider(create: (_) => AuthBloc(authRepository: authRepository)),
          BlocProvider(create: (_) => UserBloc(userRepository: userRepository)),
        ], 
        child: MyApp()
      )
    )
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
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
