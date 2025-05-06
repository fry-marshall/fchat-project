
import 'package:mobile_fchat/state/models/conversation.dart';

abstract class MessageEvent {}

class GetAllUserMessagesRequested extends MessageEvent {
  GetAllUserMessagesRequested();
}

class SendMessageRequested extends MessageEvent {
  String? sender_id;
  String? user_id;
  String? content;
  SendMessageRequested(this.user_id, this.sender_id, this.content);
}

class ReadMessageRequested extends MessageEvent {
  String? conversation_id;
  ReadMessageRequested(this.conversation_id);
}

class SetCurrentConversationRequested extends MessageEvent {
  Conversation conversation;
  SetCurrentConversationRequested(this.conversation);
}
