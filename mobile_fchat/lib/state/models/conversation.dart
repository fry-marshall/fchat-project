import 'package:mobile_fchat/state/models/message.dart';

class Conversation{
  String? id;
  String? user1_id;
  String? user2_id;
  List<Message>? messages;


  Conversation({
    this.id,
    this.user1_id,
    this.user2_id,
    this.messages,
  });

  Conversation.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    user1_id = json['user1']["id"];
    user2_id = json['user2']["id"];
    messages = json['messages'].map<Message>((message) => Message.fromJson(message)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['user1_id'] = user1_id;
    data['user2_id'] = user2_id;
    data['messages'] = messages;
    return data;
  }
}