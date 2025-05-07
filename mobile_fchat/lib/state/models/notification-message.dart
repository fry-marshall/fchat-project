
class NotificationMessage{
  String? id;
  String? content;
  String? date;
  String? sender_id;
  String? conversation_id;

  NotificationMessage({
    this.id,
    this.content,
    this.date,
    this.sender_id,
    this.conversation_id,
  });

  NotificationMessage.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    content = json['content'];
    date = json['date'];
    sender_id = json['sender_id'];
    conversation_id = json['conversation_id'];
  }
}