import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { AppState } from '../app.state';
import {
  getCurrentConversation,
  getMessages,
  getReceiverUserInfos,
  hasConversationSelected,
} from './message.selector';
import { Conversation, Message, Notification } from './message.interface';
import { User } from '@library_v2/interfaces/user';
import {
  GetAllUserMessagesActions,
  NotifyNewMessage,
  NotifyReadMessage,
  ReadMessagesActions,
  SendNewMessageActions,
  SetCurrentConversation,
} from './message.actions';

@Injectable({
  providedIn: 'root',
})
export class MessageFacade {
  constructor(protected store: Store<AppState>, protected actions$: Actions) {}

  messages$ = this.store.select(getMessages);
  currentConversation$ = this.store.select(getCurrentConversation);
  hasConversationSelected$ = this.store.select(hasConversationSelected);
  receiverUserInfos$ = this.store.select(getReceiverUserInfos);

  getAllUserMessages() {
    this.store.dispatch(GetAllUserMessagesActions.getAllUserMessages());

    return this.actions$.pipe(
      ofType(
        GetAllUserMessagesActions.getAllUserMessagesSuccess,
        GetAllUserMessagesActions.getAllUserMessagesFailure
      ),
      take(1)
    );
  }

  sendNewMessage(content: string, receiver_id: string, sender_id: string) {
    this.store.dispatch(
      SendNewMessageActions.sendNewMessage({
        content,
        user_id: receiver_id,
        sender_id,
      })
    );

    return this.actions$.pipe(
      ofType(
        SendNewMessageActions.sendNewMessageSuccess,
        SendNewMessageActions.sendNewMessageFailure
      ),
      take(1)
    );
  }

  setCurrentConversation(conversation: Conversation) {
    this.store.dispatch(
      SetCurrentConversation({ conversation })
    );
  }

  readMessages(conversation_id: string, user_id: string) {
    this.store.dispatch(
      ReadMessagesActions.readMessages({ conversation_id, user_id })
    );
  }

  notifyNewMessage(notification: Notification, receiver_id: string) {
    this.store.dispatch(
      NotifyNewMessage({ notification, receiver_id })
    );
  }

  notifyReadMessage(body: { messages: Message[]; conversation_id: string }) {
    this.store.dispatch(
      NotifyReadMessage({
        messages: body.messages,
        conversation_id: body.conversation_id,
      })
    );
  }

  getUserInfos(
    currentConversation?: Conversation,
    currentUser?: Partial<User>,
    users?: Partial<User>[]
  ) {
    let userId: string | undefined = '';

    const message = currentConversation?.messages[0];
    if (message?.receiver.id === currentUser?.id) {
      userId = message!.sender.id;
    } else {
      userId = message!.receiver.id;
    }

    return users?.find((user) => user.id === userId);
  }
}
