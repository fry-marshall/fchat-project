import { createReducer, on } from "@ngrx/store";
import * as messageActions from "./message.actions";
import { initialMessageState } from "./message.state";

export const messageReducer = createReducer(
    initialMessageState,

    // get all messages
    on(messageActions.GetAllUserMessages, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(messageActions.GetAllUserMessagesSuccess, (state, { allMessages }) => {
        return { ...state, allMessages, isLoading: false }
    }),

    on(messageActions.GetAllUserMessagesFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    // send new message
    on(messageActions.SendNewMessage, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(messageActions.SendNewMessageSuccess, (state, { content, conversation_id, receiver_id, message_id }) => {
        const allMessages = state.allMessages?.map(messages => {
            if(messages.conversation_id === conversation_id){
                return {
                    conversation_id: messages.conversation_id,
                    messages: [
                        ...messages.messages,
                        {id: message_id, receiver_id, content}
                    ]
                }
            }
            return messages
        })
        return { ...state, allMessages, isLoading: false }
    }),

    on(messageActions.SendNewMessageFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    //set current conversation
    on(messageActions.SetCurrentConversationId, (state, {conversation_id}) => {
        return {...state, currentConversationId: conversation_id}
    }),

)