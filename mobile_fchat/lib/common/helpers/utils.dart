import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';

class Utils {
  static const storage = FlutterSecureStorage();

  static isAndroid(BuildContext context) {
    return Theme.of(context).platform == TargetPlatform.android;
  }

  static double height(BuildContext context) {
    return MediaQuery.of(context).size.height;
  }

  static double width(BuildContext context) {
    return MediaQuery.of(context).size.width;
  }

  static pusherRemove(BuildContext context, Widget destination) {
    Navigator.of(context).pushAndRemoveUntil(
      CupertinoPageRoute(builder: (context) => destination),
      (route) => false,
    );
  }

  static pusher(BuildContext context, Widget destination) {
    Navigator.of(
      context,
    ).push(CupertinoPageRoute(builder: (context) => destination));
  }

  static String? DefaultValidator(String? value) {
    if (value == null || value.isEmpty || value.trim().isEmpty) {
      return "Required field";
    } else {
      return null;
    }
  }

  static String? phoneValidator(String? value, bool isCiv) {
    if (value == null || value.isEmpty || value.trim().isEmpty) {
      return "Required field";
    } else if (value.length != 10) {
      return "Numéro de téléphone incorrecte";
    } else if (isCiv &&
        value.substring(0, 2) != "01" &&
        value.substring(0, 2) != "05" &&
        value.substring(0, 2) != "08") {
      return "Numéro de téléphone incorrecte";
    } else if (!isCiv &&
        value.substring(0, 2) != "06" &&
        value.substring(0, 2) != "07") {
      return "Numéro de téléphone incorrecte";
    } else {
      return null;
    }
  }

  static String? EmailValidator(String? value) {
    final RegExp emailRegExp = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    if (value == null || value.isEmpty || value.trim().isEmpty) {
      return "Required field";
    } else if (!emailRegExp.hasMatch(value)) {
      return "Email incorrecte";
    }
    return null;
  }

  static String? PasswordValidator(String? value) {
    final RegExp passwordRegExp = RegExp(r'^(?=.*[A-Za-z])(?=.*\d).+$');
    if (value == null || value.isEmpty || value.trim().isEmpty) {
      return "Required field";
    } else if (!passwordRegExp.hasMatch(value)) {
      return "Should contain at least with one letter and one number";
    } else if (value.length < 8) {
      return "Should have at least 8 characters";
    } else {
      return null;
    }
  }

  static getUri(String path) {
    return Uri.https(dotenv.env['API_URL']!, path).toString();
    /* if(kReleaseMode){
      return Uri.https(dotenv.env['API_URL']!, path );
    }*/
    // Uri.http(dotenv.env['API_URL']!, path );
  }

  static getUrl(String path) {
    return "${dotenv.env['API_URL']}$path";
  }

  static getImgUrl() {
    return 'https://${dotenv.env['API_URL']!}';

    /* if (kReleaseMode) {
    }
    return 'http://${dotenv.env['API_URL']!}'; */
  }

  static storeValue({required String key, required String value}) async {
    await storage.write(key: key, value: value);
  }

  static getValue({required String key}) async {
    return await storage.read(key: key);
  }

  static deleteValue({required String key}) async {
    await storage.delete(key: key);
  }

  static String capitalize(String value) {
    return "${value[0].toUpperCase()}${value.substring(1).toLowerCase()}";
  }

  static String convertDatetoBackendFormat({required String dateStr}) {
    DateTime dateTime = DateTime.parse(dateStr).toLocal();
    var formatter = DateFormat('dd/MM/yyyy');
    String dateString = formatter.format(dateTime);
    DateTime date = formatter.parse(dateString);

    return '${date.day}/${date.month}/${date.year}';
  }

  static String formatDate(String date_) {
    if (date_ == '') {
      return '';
    }
    DateTime date = DateTime.parse(date_).toLocal();
    DateTime now = DateTime.now();
    DateTime yesterday = now.subtract(Duration(days: 1));

    if (isSameDay(now, date)) {
      return DateFormat('HH:mm').format(date);
    } else if (isSameDay(yesterday, date)) {
      return "Yesterday";
    } else {
      return DateFormat('dd/MM/yyyy').format(date);
    }
  }

  static bool isSameDay(DateTime day1, DateTime day2) {
    return day1.year == day2.year &&
        day1.month == day2.month &&
        day1.day == day2.day;
  }
}
