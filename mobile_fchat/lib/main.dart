import 'package:flutter/material.dart';
import 'package:mobile_fchat/views/home.dart';

void main() {
  runApp(const MyApp());
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
