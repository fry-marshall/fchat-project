import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/button.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/custom-text-field.dart';
import 'package:mobile_fchat/common/widgets/common-widgets.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.bloc.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.event.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.state.dart';
import 'package:mobile_fchat/views/authentication/authentication.dart';

class ForgotPasswordPage extends StatefulWidget {
  @override
  State<ForgotPasswordPage> createState() => ForgotPasswordPageState();
}

class ForgotPasswordPageState extends State<ForgotPasswordPage> {
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController controllerEmail = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
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
          controllerEmail.clear();
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return CommonWidgets.simpleDialog(
                title: "Success !",
                content: "You\'ve received an email to reset your password.",
                textButton: "Ok",
                context: context,
                action: (){
                  Utils.pusherRemove(context, AuthenticationPage());
                }
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
              "Forgot password",
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
                  const Spacer(),
                  CustomButton(
                    title: "Reset password",
                    isLoading: state.status == AuthStatus.loading,
                    action: () {
                      if (_formKey.currentState!.validate()) {
                        context.read<AuthBloc>().add(
                          ForgotPasswordRequested(
                            controllerEmail.text,
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
