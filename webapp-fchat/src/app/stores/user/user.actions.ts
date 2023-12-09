import { User } from "@library_v2/interfaces/user"
import { createAction, props } from "@ngrx/store"


export const GetAllUsersAccount = createAction(
    "[User] get all users account",
) 

export const GetAllUsersAccountSuccess = createAction(
    "[User] get all users account success",
    props<{allUsers: {users: User[], currentUserId: string}}>()
) 

export const GetAllUsersAccountFailure = createAction(
    "[User] get all users account failure",
    props<{error: any}>()
)


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


export const LogOutUser = createAction(
    "[User] log out user",
) 

export const LogOutUserSuccess = createAction(
    "[User] log out success",
) 

export const LogOutUserFailure = createAction(
    "[User] log out failure",
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


export const DeleteUser = createAction(
    "[User] delete user",
) 

export const DeleteUserSuccess = createAction(
    "[User] delete user success",
) 

export const DeleteUserFailure = createAction(
    "[User] delete user failure",
    props<{error: any}>()
)


export const UpdateUserAccount = createAction(
    "[User] update user account",
    props<{user: User}>()
) 

export const UpdateUserAccountSuccess = createAction(
    "[User] update user account success",
    props<{user: User}>()
) 

export const UpdateUserAccountFailure = createAction(
    "[User] update user account failure",
    props<{error: any}>()
)


export const UpdateUserProfilImg = createAction(
    "[User] update user profile img",
    props<{profile_img: any}>()
) 

export const UpdateUserProfilImgSuccess = createAction(
    "[User] update user profile img success",
) 

export const UpdateUserProfilImgFailure = createAction(
    "[User] update user profile img failure",
    props<{error: any}>()
)