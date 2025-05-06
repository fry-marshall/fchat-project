import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile_fchat/state/models/user.dart';

Widget userCard(User user) {
  return Container(
    margin: EdgeInsets.only(bottom: 10),
    child: Row(
      children: [
        CircleAvatar(
          radius: 25,
          backgroundImage: NetworkImage(
            'https://${dotenv.env['ASSETS_URL']!}/${user.profile_img}',
          ),
        ),
        const SizedBox(width: 20),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 300,
              child: Text(user.fullname!, style: TextStyle(fontWeight: FontWeight.bold)),
            ),
            SizedBox(
              width: 300,
              child: Text(user.description ?? 'Non défini', maxLines: 1, style: TextStyle(fontSize: 12, overflow: TextOverflow.ellipsis)),
            )
          ],
        ),
      ],
    ),
  );
}
