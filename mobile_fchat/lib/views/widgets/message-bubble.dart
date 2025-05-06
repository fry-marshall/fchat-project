import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_fchat/state/models/message.dart';

Widget MessageBubble(Message? message, bool isLeft) {
  DateTime dateParsed = DateTime.parse(message?.date ?? '').toLocal();

  String date = DateFormat('HH:mm').format(dateParsed);

  return Container(
    padding: EdgeInsets.all(5),
    margin: EdgeInsets.only(bottom: 20),
    decoration: BoxDecoration(
      color: isLeft ? Colors.grey : Colors.blue,
      borderRadius: BorderRadius.circular(5),
    ),
    width: 150,
    child: Column(
      crossAxisAlignment:
          (isLeft) ? CrossAxisAlignment.start : CrossAxisAlignment.end,
      mainAxisSize: MainAxisSize.min,
      children: [
        Align(
          alignment: Alignment.topLeft,
          child: Text(
            message?.content ?? '',
            style: TextStyle(color: Colors.white, fontSize: 14),
          ),
        ),
        Align(
          alignment: Alignment.bottomRight,
          child: Text(date, style: TextStyle(color: Colors.white)),
        ),
      ],
    ),
  );
}
