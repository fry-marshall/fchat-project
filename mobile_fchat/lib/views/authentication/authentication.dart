import 'package:flutter/material.dart';
import 'package:mobile_fchat/common/button.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/views/authentication/signin.dart';
import 'package:mobile_fchat/views/authentication/signup.dart';

class AuthenticationPage extends StatefulWidget {
  @override
  State<AuthenticationPage> createState() => AuthenticationPageState();
}

class AuthenticationPageState extends State<AuthenticationPage> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: null,
        centerTitle: true,
        title: Image.asset('assets/logo.png', width: 45),
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CustomButton(
              title: "Sign In",
              action: () {
                Utils.pusher(context, SignInPage());
              },
            ),
            const SizedBox(height: 20),
            CustomButton(
              title: "Sign Up",
              isOutlined: true,
              action: () {
                Utils.pusher(context, SignUpPage());
              },
            ),
          ],
        ),
      ),
    );
  }
}
