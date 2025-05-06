import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/models/conversation.dart';

class MessageState {
  final Status? status;
  final List<Conversation>? allConversations;
  final Conversation? currentConversation;
  final dynamic errors;

  MessageState({this.status, this.errors, this.allConversations, this.currentConversation});

  MessageState copyWith({
    Status? status,
    dynamic errors,
    Conversation? currentConversation,
    List<Conversation>? allConversations,
  }) {
    return MessageState(
      status: status,
      errors: errors,
      currentConversation: currentConversation ?? this.currentConversation,
      allConversations: allConversations ?? this.allConversations,
    );
  }
}
