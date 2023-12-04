import { ActionReducerMap } from "@ngrx/store";
import { userReducer } from "./user/user.reducer";
import { UserState } from "./user/user.state";

export interface AppState{
    userState: UserState,
}

export const reducers: ActionReducerMap<AppState, any> = {
    userState: userReducer,
}