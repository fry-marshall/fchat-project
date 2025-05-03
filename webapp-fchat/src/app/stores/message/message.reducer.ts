import { createReducer, on } from '@ngrx/store';
import { initialMessageState } from './message.state';
import { Conversation, Message } from './message.interface';
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
      let conversation: Conversation;
      const allConversations = state.allConversations?.map((conv) => {
        if (conv.id === '') {
          conversation = {
            id: conv.id,
            messages: [message],
          };
          return conversation;
        } else if (conv.id === conversation_id) {
          conversation = {
            id: conv.id,
            messages: [...conv.messages, message],
          };
          return conversation;
        }
        return conv
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

    let updateConversations = state.allConversations.map(conv => {
      if(conv.id === notification.conversation_id){
        const message: Message = {
          id: notification.id,
          content: notification.content,
          date: notification.date,
          sender: {id: notification.sender_id},
          receiver: {id: receiver_id},
        }
        return {...conv, messages: [...conv.messages, message]}
      }
      return conv
    });

    if(!updateConversations.find(conv => conv.id === notification.conversation_id)){
      updateConversations = [
        ...updateConversations,
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
        }
      ]
    }

    let currentConversation = state.currentConversation
    if(!!currentConversation){
      currentConversation = updateConversations.find(conv => conv.id === currentConversation.id)
    }

    return { ...state, allConversations: updateConversations, currentConversation };
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
  on(NotifyReadMessage, (state, { user_id, conversation_id }) => {
    let updateConversations = state.allConversations.map(conv => {
      if(conv.id === conversation_id){
        return {...conv, messages: conv.messages.map((message) => {
          if(message.sender.id === user_id){
            return {...message, is_read: true}
          }
          return message
        })}
      }
      return conv
    })

    return { ...state, allConversations: updateConversations };
  })
);
