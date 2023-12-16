import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { AppState } from "../app.state";
import * as messageActions from "./message.actions";
import { getCurrentConversation, getMessages, hasConversationSelected } from "./message.selector";
import { Conversation } from "./message.interface";

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
    
    getAllMessages(){
        this.store.dispatch(messageActions.GetAllUserMessages())

        return this.actions$.pipe(
            ofType(messageActions.GetAllUserMessagesSuccess),
            take(1)
        )
    }

    sendNewMessage(content: string, receiver_id: string){
        this.store.dispatch(messageActions.SendNewMessage({content, receiver_id}))

        return this.actions$.pipe(
            ofType(messageActions.SendNewMessageSuccess),
            take(1)
        )
    }

    setCurrentConversation(conversation: Conversation){
        this.store.dispatch(messageActions.SetCurrentConversation({conversation}))
    }
}