import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { getCurrentUser, getUsers } from "../user/user.selector";


const messageState = (state: AppState) => state.messageState
const userState = (state: AppState) => state.userState


export const getMessages = createSelector(
    messageState,
    (messages) => {
        return messages.allMessages?.filter(msg => !!msg.messages[0].sender_id && !!msg.messages[0].receiver_id) ?? []
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

export const getReceiverUserInfos = createSelector(
    getCurrentConversation,
    getCurrentUser,
    getUsers,
    (currentConversation, currentUser, users) => {
        let userId: string | undefined = ''
    
        const message = currentConversation?.messages[0]
        if(message?.receiver_id === currentUser?.id){
            userId = message!.sender_id
        }
        else{
            userId = message!.receiver_id
        }

        return users.find(user => user.id === userId)
    }
)