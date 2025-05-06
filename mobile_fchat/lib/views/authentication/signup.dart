import 'package:flutter/material.dart';
import 'package:mobile_fchat/common/button.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/custom-text-field.dart';

class SignUpPage extends StatefulWidget {
  @override
  State<SignUpPage> createState() => SignUpPageState();
}

class SignUpPageState extends State<SignUpPage> {
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController controllerFullname = TextEditingController();
  TextEditingController controllerEmail = TextEditingController();
  TextEditingController controllerPassword = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: null,
        centerTitle: false,
        title: Text("Sign up", style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Container(
        width: Utils.width(context),
        padding: EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),
              CustomTextField(
                controller: controllerFullname,
                hint: "Fullname",
                validator: Utils.DefaultValidator,
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: controllerEmail,
                hint: "Email",
                validator: Utils.EmailValidator,
              ),
              const SizedBox(height: 20),
              CustomTextField(controller: controllerPassword, hint: "Password",
              validator: Utils.PasswordValidator,
              ),
              const Spacer(),
              CustomButton(
                title: "Sign up",
                action: () {
                  if (!_formKey.currentState!.validate()) {
                    print("tooo");
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
