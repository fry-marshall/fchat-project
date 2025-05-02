import { createReducer, on } from "@ngrx/store";
import { initialAuthState } from "./auth.state";
import { ForgotPasswordActions, ResetPasswordActions, SignInActions, SignUpActions, VerifyActions } from "./auth.actions";

export const authReducer = createReducer(
    initialAuthState,

    on(SignUpActions.signUp, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(SignUpActions.signUpSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(SignUpActions.signUpFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),

    on(SignInActions.signIn, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(SignInActions.signInSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(SignInActions.signInFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),

    on(ForgotPasswordActions.forgotPassword, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(ForgotPasswordActions.forgotPasswordSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(ForgotPasswordActions.forgotPasswordFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),

    on(ResetPasswordActions.resetPassword, (state, { }) => {
        return { ...state, isLoading: true }
    }),

    on(ResetPasswordActions.resetPasswordSuccess, (state, { }) => {
        return { ...state, isLoading: false }
    }),

    on(ResetPasswordActions.resetPasswordFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),

    on(VerifyActions.verifyFailure, (state, { errors }) => {
        return { ...state, isLoading: false, errors }
    }),

)