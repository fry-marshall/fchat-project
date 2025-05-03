import { createReducer, on } from "@ngrx/store";
import { initialUserState } from "./user.state";
import { DeleteUserActions, GetAllUsersActions, GetUserActions, LogOutActions, UpdateUserActions } from "./user.actions";

export const userReducer = createReducer(
    initialUserState,

    // get all users
    on(GetAllUsersActions.getAllUsers, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(GetAllUsersActions.getAllUsersSuccess, (state, { users }) => {
        return { ...state, allUsers: users, isLoading: false }
    }),

    on(GetAllUsersActions.getAllUsersFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),

    // get user
    on(GetUserActions.getUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(GetUserActions.getUserSuccess, (state, { user }) => {
        return { ...state, user, isLoading: false }
    }),

    on(GetUserActions.getUserFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),


    // logout user
    on(LogOutActions.logOut, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(LogOutActions.logOutSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(LogOutActions.logOutFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),


    // delete user account
    on(DeleteUserActions.deleteUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(DeleteUserActions.deleteUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(DeleteUserActions.deleteUserFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),


    // update user account
    on(UpdateUserActions.updateUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(UpdateUserActions.updateUserSuccess, (state, { user }) => {
        return { ...state, user: {...state.user, ...user}, isLoading: true }
    }),

    on(UpdateUserActions.updateUserFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),

)