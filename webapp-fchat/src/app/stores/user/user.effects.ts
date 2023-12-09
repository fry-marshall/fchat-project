import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "./user.services";
import * as userActions from './user.actions';
import { catchError, map, of, switchMap } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService,
        private cookieService: CookieService
    ) { }

    getAllUsers = createEffect(() => this.actions$.pipe(
        ofType(userActions.GetAllUsersAccount),
        switchMap(() => {
            return this.userService.getAllUsers().pipe(
                map((users) => userActions.GetAllUsersAccountSuccess(users)),
                catchError((error) =>of(userActions.GetAllUsersAccountFailure(error)))
            )
        })
    ))

    signUpUser = createEffect(() => this.actions$.pipe(
        ofType(userActions.CreateUserAccount),
        switchMap(({ user }) => {
            return this.userService.signUpUser(user).pipe(
                map((data) => userActions.CreateUserAccountSuccess()),
                catchError((error) =>of(userActions.CreateUserAccountFailure(error)))
            )
        })
    ))

    logInUser = createEffect(() => this.actions$.pipe(
        ofType(userActions.LogInUser),
        switchMap(({ login, password }) => {
            return this.userService.logInUser({login, password}).pipe(
                map((value: any) => {
                    this.cookieService.set('access_token', value.data.access_token)
                    this.cookieService.set('refresh_token', value.data.refresh_token)
                    return userActions.LogInUserSuccess()
                }),
                catchError((error) => of(userActions.LogInUserFailure(error)))
            )
        })
    ))

    logOutUser = createEffect(() => this.actions$.pipe(
        ofType(userActions.LogOutUser),
        switchMap(() => {
            return this.userService.logOutUser().pipe(
                map(() => {
                    this.cookieService.delete('access_token')
                    this.cookieService.delete('refresh_token')
                    window.location.href = 'https://auth-fchat.mfry.io'
                    return userActions.LogOutUserSuccess()
                }),
                catchError((error) => of(userActions.LogOutUserFailure(error)))
            )
        })
    ))

    forgotPassword = createEffect(() => this.actions$.pipe(
        ofType(userActions.ForgotPasswordUser),
        switchMap(({ email }) => {
            return this.userService.forgotPassword(email).pipe(
                map((value) => userActions.ForgotPasswordUserSuccess()),
                catchError((error) => of(userActions.ForgotPasswordUserFailure(error)))
            )
        })
    ))

    resetPassword = createEffect(() => this.actions$.pipe(
        ofType(userActions.ResetPasswordUser),
        switchMap(({ password, confirm_password }) => {
            return this.userService.resetPassword(password, confirm_password).pipe(
                map((value) => userActions.ResetPasswordUserSuccess()),
                catchError((error) => of(userActions.ResetPasswordUserFailure(error)))
            )
        })
    ))

    verifyEmail = createEffect(() => this.actions$.pipe(
        ofType(userActions.VerifyEmailUser),
        switchMap(() => {
            return this.userService.verifyEmail().pipe(
                map((value) => userActions.VerifyEmailUserSuccess()),
                catchError((error) => of(userActions.VerifyEmailUserFailure(error)))
            )
        })
    ))

    deleteUser = createEffect(() => this.actions$.pipe(
        ofType(userActions.DeleteUser),
        switchMap(() => {
            return this.userService.deleteUser().pipe(
                map(() => {
                    this.cookieService.delete('access_token')
                    this.cookieService.delete('refresh_token')
                    window.location.href = 'https://auth-fchat.mfry.io'
                    return userActions.DeleteUserSuccess()
                }),
                catchError((error) => of(userActions.DeleteUserFailure(error)))
            )
        })
    ))

    updateUser = createEffect(() => this.actions$.pipe(
        ofType(userActions.UpdateUserAccount),
        switchMap(({ user }) => {
            return this.userService.updateUser(user).pipe(
                map((value) => userActions.UpdateUserAccountSuccess({user})),
                catchError((error) => of(userActions.UpdateUserAccountFailure(error)))
            )
        })
    ))

    updateUserProfile = createEffect(() => this.actions$.pipe(
        ofType(userActions.UpdateUserProfilImg),
        switchMap(({ profile_img }) => {
            return this.userService.updateUserProfileImg(profile_img).pipe(
                map(() => userActions.UpdateUserProfilImgSuccess()),
                catchError((error) => of(userActions.UpdateUserProfilImgFailure(error)))
            )
        })
    ))
}