import { createReducer, on } from "@ngrx/store";
import { initialUserState } from "./user.state";
import * as userActions from "./user.actions";

export const userReducer = createReducer(
    initialUserState,

    // get all users
    on(userActions.GetAllUsersAccount, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.GetAllUsersAccountSuccess, (state, { allUsers }) => {
        const user = allUsers.users.find(user => user?.id === allUsers.currentUserId) ?? null
        const users = allUsers.users ?? null
        return { ...state, allUsers: users, user, isLoading: false }
    }),

    on(userActions.GetAllUsersAccountFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    // create user account
    on(userActions.CreateUserAccount, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.CreateUserAccountSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.CreateUserAccountFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    // log in user
    on(userActions.LogInUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.LogInUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.LogInUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    // logout user
    on(userActions.LogOutUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.LogOutUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.LogOutUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

    
    // forgot password
    on(userActions.ForgotPasswordUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.ForgotPasswordUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.ForgotPasswordUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    // delete user account
    on(userActions.DeleteUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.DeleteUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.DeleteUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    // reset password user
    on(userActions.ResetPasswordUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.ResetPasswordUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.ResetPasswordUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),


    // update user account
    on(userActions.UpdateUserAccount, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.UpdateUserAccountSuccess, (state, { user }) => {
        return { ...state, user: {...user}, isLoading: true }
    }),

    on(userActions.UpdateUserAccountFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

    
    // verfy user email account
    on(userActions.VerifyEmailUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

    


)