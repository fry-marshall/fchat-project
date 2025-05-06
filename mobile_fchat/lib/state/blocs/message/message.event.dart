
abstract class MessageEvent {}

class GetAllUserMessagesRequested extends MessageEvent {
  GetAllUserMessagesRequested();
}

class SendMessageRequested extends MessageEvent {
  String? user_id;
  String? content;
  SendMessageRequested(this.user_id, this.content);
}

class ReadMessageRequested extends MessageEvent {
  String? conversation_id;
  ReadMessageRequested(this.conversation_id);
}
