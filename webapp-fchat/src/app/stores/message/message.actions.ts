import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { Conversation, Message, Notification } from './message.interface';

export const GetAllUserMessagesActions = createActionGroup({
  source: 'GetAllUserMessages',
  events: {
    'Get All User Messages': emptyProps(),
    'Get All User Messages Success': props<{ messages: any }>(),
    'Get All User Messages Failure': props<{ errors: any }>(),
  },
});

export const SendNewMessageActions = createActionGroup({
  source: 'SendNewMessage',
  events: {
    'Send New Message': props<{ user_id: string; content: string, sender_id: string }>(),
    'Send New Message Success': props<{ conversation_id: string, message: Partial<Message> }>(),
    'Send New Message Failure': props<{ errors: any }>(),
  },
});

export const ReadMessagesActions = createActionGroup({
  source: 'ReadMessages',
  events: {
    'ReadMessages': props<{ conversation_id: string; user_id: string}>(),
    'ReadMessages Success': props<{
      conversation_id: string;
      user_id: string
    }>(),
    'ReadMessages Failure': props<{ errors: any }>(),
  },
});

export const SetCurrentConversation = createAction(
  '[Message] set current conversation',
  props<{ conversation: Conversation }>()
);

export const NotifyNewMessage = createAction(
  '[Message] notify new message',
  props<{ notification: Notification, receiver_id: string }>()
);

export const NotifyReadMessage = createAction(
  '[Message] notify read message',
  props<{ user_id: string; conversation_id: string }>()
);
