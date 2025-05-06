import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/button.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/custom-text-field.dart';
import 'package:mobile_fchat/common/widgets/common-widgets.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';

class UpdateNamePage extends StatefulWidget {
  final String? name;
  UpdateNamePage({required this.name});
  @override
  State<UpdateNamePage> createState() => UpdateNamePageState();
}

class UpdateNamePageState extends State<UpdateNamePage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController controllerName = TextEditingController();

  @override
  void initState() {
    super.initState();
    controllerName.text = widget.name ?? '';
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
              "Fullname",
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
                    controller: controllerName,
                    hint: "Fullname",
                    validator: Utils.DefaultValidator,
                  ),
                  const Spacer(),
                  CustomButton(
                    title: "Save",
                    isLoading: state.status == Status.loading,
                    action: () {
                      if (_formKey.currentState!.validate()) {
                        context.read<UserBloc>().add(
                          UpdateUserRequested(
                            body: {
                              'fullname': controllerName.text
                            },
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
