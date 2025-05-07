import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/state/models/conversation.dart';
import 'package:mobile_fchat/state/models/message.dart';
import 'package:mobile_fchat/state/models/user.dart';

Widget conversationCard(
  Conversation conversation,
  User currentUser,
  User otherUser,
) {
  Message? lastMessage =
      conversation.messages?[conversation.messages!.length - 1];
  return Container(
    margin: EdgeInsets.only(bottom: 10),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            CircleAvatar(
              radius: 25,
              backgroundImage: NetworkImage(
                'https://${dotenv.env['ASSETS_URL']!}/${otherUser.profile_img}',
              ),
            ),
            const SizedBox(width: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  otherUser.fullname ?? '',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                Row(
                  children: [
                    (lastMessage?.sender_id == currentUser.id)
                        ? lastMessage?.is_read == true
                            ? Stack(
                              alignment: Alignment.center,
                              children: [
                                Icon(
                                  Icons.check,
                                  size: 30.0,
                                  color: Colors.blue,
                                ),
                                Icon(
                                  Icons.check,
                                  size: 20.0,
                                  color: Colors.blue,
                                ),
                              ],
                            )
                            : Stack(
                              alignment: Alignment.center,
                              children: [
                                Icon(Icons.check, size: 30.0),
                                Icon(Icons.check, size: 20.0),
                              ],
                            )
                        : SizedBox(),
                    Text(
                      lastMessage?.content ?? '',
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        Text(
          Utils.formatDate(lastMessage?.date ?? ''),
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: const Color.fromARGB(255, 83, 83, 83),
          ),
        ),
      ],
    ),
  );
}
