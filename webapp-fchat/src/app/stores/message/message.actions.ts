import { User } from "@library_v2/interfaces/user"
import { createAction, props } from "@ngrx/store"
import { Conversation, Message } from "./message.interface"


export const GetAllUserMessages = createAction(
    "[Message] get all user messages",
) 

export const GetAllUserMessagesSuccess = createAction(
    "[Message] get all user messages success",
    props<{allMessages: {conversation_id: string, messages: Message[]}[]}>()
) 

export const GetAllUserMessagesFailure = createAction(
    "[Message] get all user messages failure",
    props<{error: any}>()
)


export const SendNewMessage = createAction(
    "[Message] send new message",
    props<{content: string, receiver_id: string, sender_id: string}>()
) 

export const SendNewMessageSuccess = createAction(
    "[Message] send new message success",
    props<{conversation_id: string, message_id: string, receiver_id: string, content: string, sender_id: string}>()
) 

export const SendNewMessageFailure = createAction(
    "[Message] send new message failure",
    props<{error: any}>()
)


export const SetCurrentConversation = createAction(
    "[Message] set current conversation",
    props<{conversation: Conversation}>()
)