import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/button.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/custom-text-field.dart';
import 'package:mobile_fchat/common/inputs/password-field.dart';
import 'package:mobile_fchat/common/widgets/common-widgets.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.bloc.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.event.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.state.dart';

class SignUpPage extends StatefulWidget {
  @override
  State<SignUpPage> createState() => SignUpPageState();
}

class SignUpPageState extends State<SignUpPage> {
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController controllerFullname = TextEditingController(text: "Marshall FRY");
  TextEditingController controllerEmail = TextEditingController(text: "example@gmail.com");
  TextEditingController controllerPassword = TextEditingController(text: "Marshall1998");

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) async {
        if (!ModalRoute.of(context)!.isCurrent) return;
        if (state.status == AuthStatus.failure) {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return CommonWidgets.simpleDialog(
                title: "Error",
                content: state.errors,
                textButton: "Ok",
                context: context,
              );
            },
          );
        } else if (state.status == AuthStatus.success) {
          _formKey.currentState!.reset();
          controllerFullname.clear();
          controllerEmail.clear();
          controllerPassword.clear();

          setState(() {
            _formKey = GlobalKey<FormState>();
          });
          await showDialog(
            context: context,
            builder: (BuildContext context2) {
              return CommonWidgets.simpleDialog(
                title: "Success !",
                content:
                    "Your account has been created successfully. \n You'll receive an email to activate it.",
                textButton: "Ok",
                context: context2,
                action: () {
                  Navigator.pop(context);
                },
              );
            },
          );
        }
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            backgroundColor: null,
            centerTitle: false,
            title: Text(
              "Sign up",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
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
                  PasswordField(
                    controller: controllerPassword,
                    hint: "Password",
                    validator: Utils.PasswordValidator,
                  ),
                  const Spacer(),
                  CustomButton(
                    title: "Sign up",
                    isLoading: state.status == AuthStatus.loading,
                    action: () {
                      if (_formKey.currentState!.validate()) {
                        context.read<AuthBloc>().add(
                          SignUpRequested(
                            controllerFullname.text,
                            controllerEmail.text,
                            controllerPassword.text,
                          ),
                        );
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
