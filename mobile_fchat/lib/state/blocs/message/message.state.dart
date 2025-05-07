import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/models/conversation.dart';

class MessageState {
  final Status? status;
  final List<Conversation>? allConversations;
  final List<Conversation>? allConversationsFiltered;
  final Conversation? currentConversation;
  final dynamic errors;

  MessageState({this.status, this.errors, this.allConversations, this.currentConversation, this.allConversationsFiltered});

  MessageState copyWith({
    Status? status,
    dynamic errors,
    Conversation? currentConversation,
    List<Conversation>? allConversations,
    List<Conversation>? allConversationsFiltered,
  }) {
    return MessageState(
      status: status,
      errors: errors,
      currentConversation: currentConversation ?? this.currentConversation,
      allConversations: allConversations ?? this.allConversations,
      allConversationsFiltered: allConversationsFiltered ?? this.allConversationsFiltered,
    );
  }
}
