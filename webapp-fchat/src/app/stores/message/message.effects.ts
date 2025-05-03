import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from './message.services';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  GetAllUserMessagesActions,
  ReadMessagesActions,
  SendNewMessageActions,
} from './message.actions';

@Injectable()
export class MessageEffects {
  constructor(
    private actions$: Actions,
    private messageService: MessageService
  ) {}

  getallConversations = createEffect(() =>
    this.actions$.pipe(
      ofType(GetAllUserMessagesActions.getAllUserMessages),
      switchMap(() => {
        return this.messageService.getallConversations().pipe(
          map(({ data }) => {
            return GetAllUserMessagesActions.getAllUserMessagesSuccess({
              messages: data.conversations,
            });
          }),
          catchError((error) =>
            of(GetAllUserMessagesActions.getAllUserMessagesFailure(error))
          )
        );
      })
    )
  );

  sendNewMessage = createEffect(() =>
    this.actions$.pipe(
      ofType(SendNewMessageActions.sendNewMessage),
      switchMap(({ content, user_id, sender_id }) => {
        return this.messageService.sendNewMessage({ content, user_id }).pipe(
          map(({ data }) =>
            SendNewMessageActions.sendNewMessageSuccess({
              conversation_id: data.conversation_id,
              message: {
                content,
                receiver: {id: user_id},
                sender: {id: sender_id},
                id: data.conversation.message.id,
                date: data.conversation.message.date,
              },
            })
          ),
          catchError((error) =>
            of(SendNewMessageActions.sendNewMessageFailure(error))
          )
        );
      })
    )
  );

  readMessages = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadMessagesActions.readMessages),
      switchMap(({ conversation_id, user_id }) => {
        return this.messageService.readMessage(conversation_id).pipe(
          map(() =>
            ReadMessagesActions.readMessagesSuccess({ conversation_id, user_id })
          ),
          catchError((error) => of(ReadMessagesActions.readMessagesFailure(error)))
        );
      })
    )
  );
}
