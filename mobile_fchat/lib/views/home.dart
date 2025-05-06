
import 'package:flutter/material.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/views/authentication/authentication.dart';

class HomePage extends StatefulWidget{

  State<HomePage> createState() => HomePageState();
}

class HomePageState extends State<HomePage>{
  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(milliseconds: 4000), (){
      Utils.pusherRemove(context, AuthenticationPage());
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Image.asset('assets/logo.png', width: 100,)
      ),
    );
  }
}