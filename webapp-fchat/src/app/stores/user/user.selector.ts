import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";


const userState = (state: AppState) => state.userState


export const getUsers = createSelector(
    userState,
    (users) => {
        return users.allUsers ?? []
    }
)

export const getCurrentUser = createSelector(
    userState,
    (users) => {
        return users.user
    }
)