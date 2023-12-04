import { User } from "@library_v2/interfaces/user"
import { createAction, props } from "@ngrx/store"


export const CreateUserAccount = createAction(
    "[User] create user account",
    props<{user: Partial<User>}>()
) 

export const CreateUserAccountSuccess = createAction(
    "[User] create user account success",
) 

export const CreateUserAccountFailure = createAction(
    "[User] create user account failure",
    props<{error: any}>()
)


export const LogInUser = createAction(
    "[User] log in user",
    props<{login: string, password: string}>()
) 

export const LogInUserSuccess = createAction(
    "[User] log in success",
) 

export const LogInUserFailure = createAction(
    "[User] log in failure",
    props<{error: any}>()
)


export const ForgotPasswordUser = createAction(
    "[User] forgot password user",
    props<{email: string}>()
) 

export const ForgotPasswordUserSuccess = createAction(
    "[User] forgot password success",
) 

export const ForgotPasswordUserFailure = createAction(
    "[User] forgot password failure",
    props<{error: any}>()
)


export const ResetPasswordUser = createAction(
    "[User] reset password user",
    props<{password: string, confirm_password: string}>()
) 

export const ResetPasswordUserSuccess = createAction(
    "[User] reset password success",
) 

export const ResetPasswordUserFailure = createAction(
    "[User] reset password failure",
    props<{error: any}>()
)


export const VerifyEmailUser = createAction(
    "[User] verify email user",
) 

export const VerifyEmailUserSuccess = createAction(
    "[User] verify email success",
) 

export const VerifyEmailUserFailure = createAction(
    "[User] verify email failure",
    props<{error: any}>()
)