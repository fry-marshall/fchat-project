import { createReducer, on } from '@ngrx/store';
import { initialMessageState } from './message.state';
import { Conversation } from './message.interface';
import {
  GetAllUserMessagesActions,
  NotifyNewMessage,
  NotifyReadMessage,
  ReadMessagesActions,
  SendNewMessageActions,
  SetCurrentConversation,
} from './message.actions';

export const messageReducer = createReducer(
  initialMessageState,

  // get all messages
  on(GetAllUserMessagesActions.getAllUserMessages, (state, {}) => {
    return { ...state, isLoading: true };
  }),

  on(
    GetAllUserMessagesActions.getAllUserMessagesSuccess,
    (state, { messages }) => {
      return { ...state, allConversations: messages, isLoading: false };
    }
  ),

  on(
    GetAllUserMessagesActions.getAllUserMessagesFailure,
    (state, { errors }) => {
      return { ...state, isLoading: false, errors };
    }
  ),

  // send new message
  on(SendNewMessageActions.sendNewMessage, (state, {}) => {
    return { ...state, isLoading: true };
  }),

  on(
    SendNewMessageActions.sendNewMessageSuccess,
    (state, { conversation_id, message }) => {
      let conversation;
      const allConversations = state.allConversations?.map((conv) => {
        if (conv.id === '') {
          conversation = {
            conversation_id,
            messages: [message],
          };
          return conversation;
        } else if (conv.id === conversation_id) {
          conversation = {
            conversation_id: conv.id,
            messages: [...conv.messages, message],
          };
          return conversation;
        }
        return conv;
      });
      return {
        ...state,
        allConversations,
        isLoading: false,
        currentConversation: conversation,
      };
    }
  ),

  on(SendNewMessageActions.sendNewMessageFailure, (state, { errors }) => {
    return { ...state, isLoading: false, errors };
  }),

  //set current conversation
  on(SetCurrentConversation, (state, { conversation }) => {
    const hasConv = state.allConversations?.some(
      (conv) => conv.id === conversation.id
    );
    if (!hasConv) {
      return {
        ...state,
        currentConversation: conversation,
      };
    }
    return { ...state, currentConversation: conversation };
  }),

  //notify new message
  on(NotifyNewMessage, (state, { notification, receiver_id }) => {
    const convExisted = state.allConversations?.some(
      (conv) => conv.id === notification.conversation_id
    );
    let updateMessages = state.allConversations;
    if (convExisted) {
      updateMessages = state.allConversations?.map((conv) => {
        if (conv.id === notification.conversation_id) {
          conv = {
            ...conv,
            messages: [
              ...conv.messages,
              {
                date: notification.date,
                sender: { id: notification.sender_id },
                receiver: { id: receiver_id },
                content: notification.content,
              },
            ],
          };
        }
        return conv;
      });
    } else {
      updateMessages = [
        ...updateMessages,
        {
          id: notification.conversation_id,
          messages: [
            {
              date: notification.date,
              sender: { id: notification.sender_id },
              receiver: { id: receiver_id },
              content: notification.content,
            },
          ],
        },
      ];
    }

    return { ...state, allConversations: updateMessages };
  }),

  //read messages
  on(
    ReadMessagesActions.readMessagesSuccess,
    (state, { conversation_id, user_id }) => {
      let updateMessages = state.allConversations?.map((conv) => {
        if (conv.id === conversation_id) {
          conv = {
            ...conv,
            messages: [...conv.messages].map((msg) => {
              if (msg.receiver.id === user_id) {
                return {
                  ...msg,
                  is_read: true,
                };
              }
              return msg;
            }),
          };
          return conv;
        }
        return conv;
      });

      return { ...state, allConversations: updateMessages };
    }
  ),

  //notify read message
  on(NotifyReadMessage, (state, { messages, conversation_id }) => {
    let convExisted = state.allConversations!.find(
      (conv) => conv.id === conversation_id
    );
    convExisted = {
      ...convExisted,
      messages: convExisted?.messages.map((msg) => {
        const msgExisted = messages.find((m) => m.id === msg.id);
        if (msgExisted) {
          return msgExisted;
        }
        return msg;
      }),
    };

    let updateMessages = state.allConversations;
    updateMessages = state.allConversations?.map((conv) => {
      if (conv.id === conversation_id) {
        return convExisted;
      }
      return conv;
    });

    return { ...state, allConversations: updateMessages };
  })
);
