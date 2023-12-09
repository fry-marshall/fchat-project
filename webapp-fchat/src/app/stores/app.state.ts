import { ActionReducerMap } from "@ngrx/store";
import { userReducer } from "./user/user.reducer";
import { UserState } from "./user/user.state";
import { MessageState } from "./message/message.state";
import { messageReducer } from "./message/message.reducer";

export interface AppState{
    userState: UserState,
    messageState: MessageState
}

export const reducers: ActionReducerMap<AppState, any> = {
    userState: userReducer,
    messageState: messageReducer
}