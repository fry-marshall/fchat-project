import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";


const messageState = (state: AppState) => state.messageState


export const getMessages = createSelector(
    messageState,
    (messages) => {
        return messages.allMessages ?? []
    }
)

export const getCurrentConversation = createSelector(
    messageState,
    (messages) => {
        const conversation = messages.allMessages?.find(m => m.conversation_id === messages.currentConversation?.conversation_id)
        return conversation
    }
)

export const hasConversationSelected = createSelector(
    messageState,
    (messages) => {
        return !!(messages.currentConversation)
    }
)