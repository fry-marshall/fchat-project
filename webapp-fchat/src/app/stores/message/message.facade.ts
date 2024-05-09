import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { AppState } from "../app.state";
import * as messageActions from "./message.actions";
import { getCurrentConversation, getMessages, getReceiverUserInfos, hasConversationSelected } from "./message.selector";
import { Conversation, Message } from "./message.interface";
import { User } from "@library_v2/interfaces/user";

@Injectable({
    providedIn: 'root'
})
export class MessageFacade{

    constructor(
        protected store: Store<AppState>,
        protected actions$: Actions
    ){
    }

    messages$ = this.store.select(getMessages)
    currentConversation$ = this.store.select(getCurrentConversation)
    hasConversationSelected$ = this.store.select(hasConversationSelected)
    receiverUserInfos$ = this.store.select(getReceiverUserInfos)
    
    getAllMessages(){
        this.store.dispatch(messageActions.GetAllUserMessages())

        return this.actions$.pipe(
            ofType(messageActions.GetAllUserMessagesSuccess),
            take(1)
        )
    }

    sendNewMessage(content: string, receiver_id: string, sender_id: string){
        this.store.dispatch(messageActions.SendNewMessage({content, receiver_id, sender_id}))

        return this.actions$.pipe(
            ofType(messageActions.SendNewMessageSuccess),
            take(1)
        )
    }

    setCurrentConversation(conversation: Conversation){
        this.store.dispatch(messageActions.SetCurrentConversation({conversation}))
    }

    readMessages(conversation_id: string, user_id: string){
        this.store.dispatch(messageActions.ReadMessages({conversation_id, user_id}))
    }

    notifyNewMessage(message: Message){
        this.store.dispatch(messageActions.NotifyNewMessage({message}))
    }

    notifyReadMessage(body: {messages: Message[], conversation_id: string}){
        this.store.dispatch(messageActions.NotifyReadMessage({messages: body.messages, conversation_id: body.conversation_id}))
    }

    getUserInfos(currentConversation?: Conversation, currentUser?: User, users?: User[]){

        let userId: string | undefined = ''
    
        const message = currentConversation?.messages[0]
        if(message?.receiver_id === currentUser?.id){
            userId = message!.sender_id
        }
        else{
            userId = message!.receiver_id
        }

        return users?.find(user => user.id === userId)
    }
}