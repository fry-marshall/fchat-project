import { createReducer, on } from "@ngrx/store";
import { initialUserState } from "./user.state";
import * as userActions from "./user.actions";

export const userReducer = createReducer(
    initialUserState,

    on(userActions.CreateUserAccount, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.CreateUserAccountSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.CreateUserAccountFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

    on(userActions.LogInUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.LogInUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.LogInUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

    on(userActions.ForgotPasswordUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.ForgotPasswordUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.ForgotPasswordUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

    on(userActions.ResetPasswordUser, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(userActions.ResetPasswordUserSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(userActions.ResetPasswordUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

    on(userActions.VerifyEmailUserFailure, (state, { error }) => {
        return { ...state, isLoading: false, error }
    }),

)