import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../helpers/utils.dart';

class CommonWidgets {
  static Widget simpleDialog(
      {required String title,
      required String content,
      dynamic action,
      required String textButton,
      required BuildContext context}) {
    return !(Utils.isAndroid(context))
        ? CupertinoAlertDialog(
            title: Text(title),
            content: Text(content),
            actions: <Widget>[
                TextButton(
                  onPressed: () {
                    if (action == null) {
                      Navigator.pop(context);
                    } else {
                      action();
                    }
                  },
                  child: Text(textButton),
                )
              ])
        : AlertDialog(
            title: Text(title),
            content: Text(content),
            actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Text(textButton),
                )
              ]);
  }

  static Widget dialogWithButtons(
      {required String title,
      required String content,
      required String textButton1,
      required String textButton2,
      required dynamic action1,
      required dynamic action2,
      required BuildContext context}) {
    return !(Utils.isAndroid(context))
        ? CupertinoAlertDialog(
            title: Text(title),
            content: Text(content),
            actions: <Widget>[
                TextButton(
                  onPressed: () {
                    action1();
                  },
                  child: Text(textButton1),
                ),
                TextButton(
                  onPressed: () {
                    action2();
                  },
                  child: Text(textButton2),
                )
              ])
        : AlertDialog(
            title: Text(title),
            content: Text(content),
            actions: <Widget>[
                TextButton(
                  onPressed: () {
                    action1();
                  },
                  child: Text(textButton1),
                ),
                TextButton(
                  onPressed: () {
                    action2();
                  },
                  child: Text(textButton2),
                )
              ]);
  }

  static Widget dialogLoading(
      {bool hasCircular = false,
      bool isLoading = true,
      required String text,
      required BuildContext context}) {
    if (isLoading) {
      return CupertinoAlertDialog(
          content: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            text,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w400),
          ),
          const SizedBox(
            width: 20,
          ),
          Center(
            child: SizedBox(
              height: 15,
              width: 15,
              child: (hasCircular)
                  ? const CircularProgressIndicator(
                      strokeWidth: 3,
                    )
                  : const Text(""),
            ),
          )
        ],
      ));
    }

    return const Text('');
  }
}
