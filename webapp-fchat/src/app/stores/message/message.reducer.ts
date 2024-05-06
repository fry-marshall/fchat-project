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

    on(messageActions.SendNewMessageSuccess, (state, { content, conversation_id, receiver_id, message_id, sender_id, date  }) => {
        let conversation;
        const allMessages = state.allMessages?.map(messages => {
            if(messages.conversation_id === ''){
                conversation = {
                    conversation_id,
                    messages: [
                        {id: message_id, receiver_id, content, sender_id, date}
                    ]
                }
                return conversation
            }
            else if(messages.conversation_id === conversation_id){
                conversation = {
                    conversation_id: messages.conversation_id,
                    messages: [
                        ...messages.messages,
                        {id: message_id, receiver_id, content, sender_id, date}
                    ]
                }
                return conversation
            }
            return messages
        })
        return { ...state, allMessages, isLoading: false, currentConversation: conversation }
    }),

    on(messageActions.SendNewMessageFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    //set current conversation
    on(messageActions.SetCurrentConversation, (state, {conversation}) => {
        const hasConv = state.allMessages?.some(conv => conv.conversation_id === conversation.conversation_id)
        if(!hasConv){
            return {...state, allMessages: [{...conversation}], currentConversation: conversation}
        }
        return {...state, currentConversation: conversation}

    }),


     //notify new message
     on(messageActions.NotifyNewMessage, (state, {message}) => {
        const convExisted = state.allMessages?.some(conv => conv.conversation_id === message.conversation_id)
        let updateMessages = state.allMessages
        if(convExisted){
            updateMessages = state.allMessages?.map(conv => {
                if(conv.conversation_id === message.conversation_id){
                    conv = {
                        ...conv,
                        messages: [...conv.messages, message]
                    }
                }
                return conv
            })
        }else{
            updateMessages = [{conversation_id: message.conversation_id, messages: [message]}]
        }
        
        return {...state, allMessages: updateMessages}
    }),

)