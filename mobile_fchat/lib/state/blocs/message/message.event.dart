import 'package:mobile_fchat/state/models/conversation.dart';
import 'package:mobile_fchat/state/models/notification-message.dart';
import 'package:mobile_fchat/state/models/user.dart';

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
  String? receiver_id;
  ReadMessageRequested(this.conversation_id, this.receiver_id);
}

class SetCurrentConversationRequested extends MessageEvent {
  Conversation conversation;
  SetCurrentConversationRequested(this.conversation);
}

class SetCurrentConversationIdRequested extends MessageEvent {
  String conversationId;
  SetCurrentConversationIdRequested(this.conversationId);
}

class NotifyNewMessageRequested extends MessageEvent {
  NotificationMessage notificationMessage;
  User user;
  NotifyNewMessageRequested(this.notificationMessage, this.user);
}

class NotifyReadMessageRequested extends MessageEvent {
  String? conversation_id;
  String? user_id;
  NotifyReadMessageRequested(this.conversation_id, this.user_id);
}

class FilterMessageRequested extends MessageEvent {
  String value;
  String user_id;
  List<User> allUsers;
  FilterMessageRequested(this.value, this.user_id, this.allUsers);
}
