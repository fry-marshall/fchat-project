import { ActionReducerMap } from "@ngrx/store";
import { AuthState } from "./auth/auth.state";
import { authReducer } from "./auth/auth.reducers";

export interface AppState{
    authState: AuthState,
}

export const reducers: ActionReducerMap<AppState, any> = {
    authState: authReducer,
}