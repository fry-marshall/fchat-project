
class Message{
  String? id;
  String? content;
  bool? is_read;
  String? date;
  String? sender_id;
  String? receiver_id;
  String? conversation_id;


  Message({
    this.id,
    this.content,
    this.is_read,
    this.date,
    this.sender_id,
    this.receiver_id,
    this.conversation_id,
  });

  Message.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    content = json['content'];
    is_read = json['is_read'];
    date = json['date'];
    sender_id = json['sender']['id'];
    receiver_id = json['receiver']['id'];
    conversation_id = json['conversation_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['content'] = content;
    data['is_read'] = is_read;
    data['date'] = date;
    data['sender_id'] = sender_id;
    data['receiver_id'] = receiver_id;
    data['conversation_id'] = conversation_id;
    return data;
  }
}