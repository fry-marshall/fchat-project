import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.event.dart';
import 'package:mobile_fchat/state/blocs/message/message.state.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/models/conversation.dart';
import 'package:mobile_fchat/state/models/message.dart';
import 'package:mobile_fchat/state/models/user.dart';
import 'package:mobile_fchat/state/repositories/message.repository.dart';
import 'package:mobile_fchat/views/conversations/conversations.dart';

class MessageBloc extends Bloc<MessageEvent, MessageState> {
  final MessageRepository messageRepository;

  MessageBloc({required this.messageRepository}) : super(MessageState()) {
    on<GetAllUserMessagesRequested>(_onGetAllUserMessagesRequested);
    on<SendMessageRequested>(_onSendMessageRequested);
    on<ReadMessageRequested>(_onReadMessageRequested);
    on<SetCurrentConversationRequested>(_onSetCurrentConversationRequested);
    on<NotifyNewMessageRequested>(_onNotifyNewMessageRequested);
    on<FilterMessageRequested>(_onFilterMessageRequested);
  }

  Future<void> _onGetAllUserMessagesRequested(
    GetAllUserMessagesRequested event,
    Emitter<MessageState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      final response = await messageRepository.getUserMessages();
      List<Conversation> conversations =
          response.data["data"]["conversations"].map<Conversation>((
            conversation,
          ) {
            return Conversation.fromJson(conversation);
          }).toList();
      conversations.sort(sortedConversations);
      emit(
        state.copyWith(status: Status.success, allConversations: conversations, allConversationsFiltered: conversations),
      );
    } catch (e) {
      print(e);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onSendMessageRequested(
    SendMessageRequested event,
    Emitter<MessageState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      var body = {'user_id': event.user_id!, 'content': event.content!};
      final response = await messageRepository.sendMessage(body);

      var conversationResponse = response.data["data"]["conversation"];

      Conversation? conversationExisted = state.allConversations?.firstWhere(
        (conv) => conv.id == conversationResponse["id"],
        orElse: () => Conversation(),
      );

      if (conversationExisted?.id == null) {
        Conversation conversation = Conversation(
          id: conversationResponse["id"],
          user1_id: event.user_id,
          user2_id: event.sender_id,
          messages: [
            Message(
              id: conversationResponse["message"]["id"],
              content: event.content,
              date: conversationResponse["message"]["date"],
              receiver_id: event.user_id,
              sender_id: event.sender_id,
              is_read: false,
            ),
          ],
        );
        List<Conversation> allConversations = state.allConversations ?? [];
        allConversations.add(conversation);
        allConversations.sort(sortedConversations);
        emit(
          state.copyWith(
            status: Status.success,
            currentConversation: conversation,
            allConversations: allConversations,
            allConversationsFiltered: allConversations,
          ),
        );
      } else {
        Message message = Message(
          id: conversationResponse["message"]["id"],
          content: event.content,
          date: conversationResponse["message"]["date"],
          receiver_id: event.user_id,
          sender_id: event.sender_id,
          is_read: false,
        );
        conversationExisted?.messages?.add(message);
        List<Conversation>? allConversations =
            state.allConversations?.map((conv) {
              if (conv.id == conversationExisted?.id) {
                return conversationExisted!;
              }
              return conv;
            }).toList();
        allConversations?.sort(sortedConversations);
        emit(
          state.copyWith(
            status: Status.success,
            currentConversation: conversationExisted,
            allConversations: allConversations,
            allConversationsFiltered: allConversations,
          ),
        );
      }
    } catch (e) {
      print(e);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onReadMessageRequested(
    ReadMessageRequested event,
    Emitter<MessageState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      var body = {'conversation_id': event.conversation_id!};
      await messageRepository.readMessage(body);

      Conversation currentConversation = Conversation();

      List<Conversation>? allConversations =
          state.allConversations?.map((conv) {
            if (conv.id == event.conversation_id) {
              List<Message>? messages =
                  conv.messages
                      ?.map<Message>(
                        (message) => Message(
                          id: message.id,
                          content: message.content,
                          is_read: true,
                          date: message.date,
                          sender_id: message.sender_id,
                          receiver_id: message.receiver_id,
                        ),
                      )
                      .toList();
              currentConversation = Conversation(
                id: conv.id,
                user1_id: conv.user1_id,
                user2_id: conv.user2_id,
                messages: messages,
              );
              return currentConversation;
            }
            return conv;
          }).toList();

      emit(
        state.copyWith(
          status: Status.success,
          currentConversation: currentConversation,
          allConversations: allConversations,
        ),
      );
    } catch (e) {
      //print(e);
      DioException exception = e as DioException;
      print(exception.response?.data);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onSetCurrentConversationRequested(
    SetCurrentConversationRequested event,
    Emitter<MessageState> emit,
  ) async {
    emit(state.copyWith(currentConversation: event.conversation));
  }

  Future<void> _onNotifyNewMessageRequested(
    NotifyNewMessageRequested event,
    Emitter<MessageState> emit,
  ) async {
    emit(state.copyWith(status: Status.loading));

    Conversation? conversationExisted = state.allConversations?.firstWhere(
      (conv) => conv.id == event.notificationMessage.conversation_id,
      orElse: () => Conversation(),
    );

    if (conversationExisted?.id == null) {
      Conversation conversation = Conversation(
        id: event.notificationMessage.conversation_id,
        user1_id: event.user.id,
        user2_id: event.notificationMessage.sender_id,
        messages: [
          Message(
            id: event.notificationMessage.id,
            content: event.notificationMessage.content,
            date: event.notificationMessage.date,
            receiver_id: event.user.id,
            sender_id: event.notificationMessage.sender_id,
            is_read: false,
          ),
        ],
      );
      List<Conversation> allConversations = state.allConversations ?? [];
      allConversations.add(conversation);
      allConversations.sort(sortedConversations);

      emit(
        state.copyWith(
          status: Status.success,
          currentConversation:
              state.currentConversation?.id == conversation.id
                  ? conversation
                  : state.currentConversation,
          allConversations: allConversations,
          allConversationsFiltered: allConversations,
        ),
      );
    } else {
      Message message = Message(
        id: event.notificationMessage.id,
        content: event.notificationMessage.content,
        date: event.notificationMessage.date,
        receiver_id: event.user.id,
        sender_id: event.notificationMessage.sender_id,
        is_read: false,
      );
      conversationExisted?.messages?.add(message);
      List<Conversation>? allConversations =
          state.allConversations?.map((conv) {
            if (conv.id == conversationExisted?.id) {
              return conversationExisted!;
            }
            return conv;
          }).toList();
      allConversations?.sort(sortedConversations);

      emit(
        state.copyWith(
          status: Status.success,
          currentConversation:
              state.currentConversation?.id == conversationExisted?.id
                  ? conversationExisted
                  : state.currentConversation,
          allConversations: allConversations,
          allConversationsFiltered: allConversations,
        ),
      );
    }
  }

  Future<void> _onFilterMessageRequested(
    FilterMessageRequested event,
    Emitter<MessageState> emit,
  ) async {
    List<Conversation>? allConversationsFiltered =
        state.allConversations?.where((conv) {
          String otherUserId =
              conv.user1_id! == event.user_id ? conv.user2_id! : conv.user1_id!;
          User otherUser = event.allUsers.firstWhere(
            (user) => otherUserId == user.id,
          );
          return otherUser.fullname?.toLowerCase().contains(event.value.toLowerCase()) ?? false;
        }).toList();

    emit(
      state.copyWith(
        status: Status.success,
        allConversationsFiltered: allConversationsFiltered,
      ),
    );
  }
}
