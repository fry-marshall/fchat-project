import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_fchat/common/button.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/widgets/common-widgets.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.bloc.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/views/authentication/authentication.dart';
import 'package:mobile_fchat/views/settings/update-description.dart';
import 'package:mobile_fchat/views/settings/update-name.dart';
import 'package:mobile_fchat/views/settings/update-password.dart';

class SettingsPage extends StatefulWidget {
  State<SettingsPage> createState() => SettingsPageState();
}

class SettingsPageState extends State<SettingsPage> {
  TextEditingController searchController = TextEditingController();
  File? _imageFile;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<UserBloc, UserState>(
      listener: (context, state) {},
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            foregroundColor: Colors.white,
            title: Text(
              "Settings",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            centerTitle: false,
            actions: [
              IconButton(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return CommonWidgets.dialogWithButtons(
                        title: "Log out",
                        content: "Do you want to log out your account ?",
                        context: context,
                        textButton1: 'No',
                        textButton2: 'Yes',
                        action1: () {
                          Navigator.pop(context);
                        },
                        action2: () {
                          context.read<AuthBloc>().add(LogoutRequested());
                          Utils.pusherRemove(context, AuthenticationPage());
                        },
                      );
                    },
                  );
                },
                icon: Icon(Icons.logout),
              ),
            ],
          ),
          body: SizedBox(
            width: Utils.width(context),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                Column(
                  children: [
                    CircleAvatar(
                      radius: 80,
                      backgroundImage: NetworkImage(
                        'https://${dotenv.env['ASSETS_URL']!}/${state.currentUser?.profile_img}',
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: 50,
                      child: CustomButton(
                        padding: EdgeInsets.all(2),
                        title: "Edit",
                        action: () {
                          if (Utils.isAndroid(context)) {
                          } else {
                            showCupertinoModalPopup(
                              context: context,
                              builder:
                                  (BuildContext context) =>
                                      CupertinoActionSheet(
                                        title: Icon(Icons.photo),
                                        actions: [
                                          CupertinoActionSheetAction(
                                            onPressed: () async {
                                              final pickedFile =
                                                  await ImagePicker().pickImage(
                                                    source: ImageSource.camera,
                                                  );

                                              if (pickedFile != null) {
                                                setState(() {
                                                  _imageFile = File(
                                                    pickedFile.path,
                                                  );
                                                });
                                              }
                                            },
                                            child: Text("Take a photo"),
                                          ),
                                          CupertinoActionSheetAction(
                                            onPressed: () async {
                                              final pickedFile =
                                                  await ImagePicker().pickImage(
                                                    source: ImageSource.gallery,
                                                  );

                                              if (pickedFile != null) {
                                                setState(() {
                                                  _imageFile = File(
                                                    pickedFile.path,
                                                  );
                                                });
                                              }
                                            },
                                            child: Text("Choose in library"),
                                          ),
                                        ],
                                      ),
                            );
                          }
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 30),
                const Divider(),
                ListTile(
                  title: Text(
                    "Fullname",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    state.currentUser?.fullname ?? 'Non défini',
                    maxLines: 1,
                    style: TextStyle(overflow: TextOverflow.ellipsis),
                  ),
                  trailing: Icon(Icons.arrow_forward_ios, size: 18),
                  onTap: () {
                    Utils.pusher(
                      context,
                      UpdateNamePage(name: state.currentUser?.fullname),
                    );
                  },
                ),
                const Divider(),
                ListTile(
                  title: Text(
                    "Description",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    state.currentUser?.description ?? 'Non défini',
                    maxLines: 1,
                    style: TextStyle(overflow: TextOverflow.ellipsis),
                  ),
                  trailing: Icon(Icons.arrow_forward_ios, size: 18),
                  onTap: () {
                    Utils.pusher(
                      context,
                      UpdateDescriptionPage(
                        description: state.currentUser?.description,
                      ),
                    );
                  },
                ),
                const Divider(),
                ListTile(
                  title: Text(
                    "Password",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text('***********'),
                  trailing: Icon(Icons.arrow_forward_ios, size: 18),
                  onTap: () {
                    Utils.pusher(context, UpdatePasswordPage());
                  },
                ),
                const Divider(),
                ListTile(
                  title: Text(
                    "Delete my account",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.redAccent,
                    ),
                  ),
                  onTap: () {
                    IconButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return CommonWidgets.dialogWithButtons(
                              title: "Log out",
                              content: "Do you want to log out your account ?",
                              context: context,
                              textButton1: 'No',
                              textButton2: 'Yes',
                              action1: () {
                                Navigator.pop(context);
                              },
                              action2: () {
                                context.read<UserBloc>().add(
                                  DeleteUserRequested(),
                                );
                                Utils.pusherRemove(
                                  context,
                                  AuthenticationPage(),
                                );
                              },
                            );
                          },
                        );
                      },
                      icon: Icon(Icons.logout),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
