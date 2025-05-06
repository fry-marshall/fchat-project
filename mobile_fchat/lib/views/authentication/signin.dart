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
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/views/authentication/forgotpassword.dart';
import 'package:mobile_fchat/views/conversations/conversations.dart';

class SignInPage extends StatefulWidget {
  @override
  State<SignInPage> createState() => SignInPageState();
}

class SignInPageState extends State<SignInPage> {
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController controllerEmail = TextEditingController(text: "jili989900@gmail.com");
  TextEditingController controllerPassword = TextEditingController(text: "Marshal1998@@");

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
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
          //TODO add requests
          context.read<UserBloc>().add(GetUserInfosRequested());
          context.read<UserBloc>().add(GetAllUsersInfosRequested());
          Utils.pusherRemove(context, ConversationsPage());
        }
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            backgroundColor: null,
            centerTitle: false,
            title: Text(
              "Sign in",
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
                  const SizedBox(height: 10),
                  Align(
                    alignment: Alignment.topRight,
                    child: InkWell(
                      onTap: () {
                        Utils.pusher(context, ForgotPasswordPage());
                      },
                      child: Text(
                        "Password forgotten ? renew here.",
                        style: TextStyle(
                          fontSize: 12,
                          color: const Color.fromARGB(255, 97, 97, 97),
                        ),
                      ),
                    ),
                  ),
                  const Spacer(),
                  CustomButton(
                    title: "Sign in",
                    isLoading: state.status == AuthStatus.loading,
                    action: () {
                      if (_formKey.currentState!.validate()) {
                        context.read<AuthBloc>().add(
                          SignInRequested(
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
