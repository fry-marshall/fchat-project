import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "./user.services";
import * as userActions from './user.actions';
import { catchError, map, of, switchMap } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService,
        private cookieService: CookieService
    ) { }

    signUpUser = createEffect(() => this.actions$.pipe(
        ofType(userActions.CreateUserAccount),
        switchMap(({ user }) => {
            return this.userService.signUpUser(user).pipe(
                map((data) => userActions.CreateUserAccountSuccess()),
                catchError((error) => of(userActions.CreateUserAccountFailure(error)))
            )
        })
    ))

    logInUser = createEffect(() => this.actions$.pipe(
        ofType(userActions.LogInUser),
        switchMap(({ login, password }) => {
            return this.userService.logInUser({ login, password }).pipe(
                map((value: any) => {
                    const accessTokenValue = value.data.access_token;
                    const refreshTokenValue = value.data.refresh_token;

                    const cookieAccessTokenString = "access_token=" + encodeURIComponent(accessTokenValue) + "; domain=.mfry.io; expires=" + + "; path=/";

                    document.cookie = cookieAccessTokenString;
                    
                    this.cookieService.set('access_token', value.data.access_token, undefined, '/', environment.cookieDomain, true)
                    this.cookieService.set('refresh_token', value.data.refresh_token, undefined, '/', environment.cookieDomain, true)
                    return userActions.LogInUserSuccess()
                }),
                catchError((error) => of(userActions.LogInUserFailure(error)))
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
}