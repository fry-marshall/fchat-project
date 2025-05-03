import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { getCurrentUser, getUsers } from '../user/user.selector';

const messageState = (state: AppState) => state.messageState;
const userState = (state: AppState) => state.userState;

export const getMessages = createSelector(messageState, (messages) => messages.allConversations);

export const getCurrentConversation = createSelector(
  messageState,
  (messages) => messages.currentConversation
);

export const hasConversationSelected = createSelector(
  messageState,
  (messages) => {
    return !!messages.currentConversation;
  }
);

export const getReceiverUserInfos = createSelector(
  messageState,
  getCurrentUser,
  getUsers,
  (messages, currentUser, users) => {
    let userId: string | undefined = '';

    const message = messages.currentConversation?.messages[0];
    if (message?.receiver.id === currentUser?.id) {
      userId = message!.sender.id;
    } else {
      userId = message!.receiver.id;
    }

    return users.find((user) => user.id === userId);
  }
);
