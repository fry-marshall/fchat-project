import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/button.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/password-field.dart';
import 'package:mobile_fchat/common/widgets/common-widgets.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';

class UpdatePasswordPage extends StatefulWidget {
  @override
  State<UpdatePasswordPage> createState() => UpdatePasswordPageState();
}

class UpdatePasswordPageState extends State<UpdatePasswordPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController controllerPassword = TextEditingController();
  TextEditingController controllerConfirmPassword = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<UserBloc, UserState>(
      listener: (context, state) {
        if (!ModalRoute.of(context)!.isCurrent) return;
        if (state.status == Status.failure) {
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
        } else if (state.status == Status.success) {
          Navigator.pop(context);
        }
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            backgroundColor: null,
            centerTitle: false,
            title: Text(
              "Password",
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
                  PasswordField(
                    controller: controllerPassword,
                    hint: "New password",
                    validator: Utils.PasswordValidator,
                  ),
                  const SizedBox(height: 20),
                  PasswordField(
                    controller: controllerConfirmPassword,
                    hint: "Confirm new password",
                    validator: Utils.PasswordValidator,
                  ),
                  const Spacer(),
                  CustomButton(
                    title: "Save",
                    isLoading: state.status == Status.loading,
                    action: () {
                      if (_formKey.currentState!.validate()) {
                        if (controllerPassword.text !=
                            controllerConfirmPassword.text) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              backgroundColor: Colors.redAccent,
                              content: Text("Passwords must be equal"),
                            ),
                          );
                        } else {
                          context.read<UserBloc>().add(
                            UpdateUserRequested(
                              body: {'password': controllerPassword.text},
                            ),
                          );
                        }
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
