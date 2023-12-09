import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MessageService } from "./message.services";
import * as messagesActions from './message.actions';
import { catchError, map, of, switchMap } from "rxjs";

@Injectable()
export class MessageEffects {

    constructor(
        private actions$: Actions,
        private messageService: MessageService,
    ) { }

    getAllMessages = createEffect(() => this.actions$.pipe(
        ofType(messagesActions.GetAllUserMessages),
        switchMap(() => {
            return this.messageService.getAllMessages().pipe(
                map(({data}) => {
                    if(data.message && data.message.length === 0){
                        return messagesActions.GetAllUserMessagesSuccess({allMessages: []})
                    }
                    else{
                        return messagesActions.GetAllUserMessagesSuccess({allMessages: data})
                    }
                }),
                catchError((error) =>of(messagesActions.GetAllUserMessagesFailure(error)))
            )
        })
    ))

    sendNewMessage = createEffect(() => this.actions$.pipe(
        ofType(messagesActions.SendNewMessage),
        switchMap(({ content, receiver_id }) => {
            return this.messageService.sendNewMessage({content, receiver_id}).pipe(
                map(({conversation_id, message_id}) => messagesActions.SendNewMessageSuccess({content, message_id, conversation_id, receiver_id})),
                catchError((error) =>of(messagesActions.SendNewMessageFailure(error)))
            )
        })
    ))
}