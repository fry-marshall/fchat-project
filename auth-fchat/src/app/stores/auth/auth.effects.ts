import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ForgotPasswordActions,
  GenerateTokenActions,
  ResetPasswordActions,
  SignInActions,
  SignUpActions,
  VerifyActions,
} from './auth.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.services';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  signUp = createEffect(() =>
    this.actions.pipe(
      ofType(SignUpActions.signUp),
      switchMap(({ params }) => {
        return this.authService.signup(params).pipe(
          map((response: any) =>
            SignUpActions.signUpSuccess({ msg: response.data.message })
          ),
          catchError((errors) => {
            return of(SignUpActions.signUpFailure(errors.error))
          })
        );
      })
    )
  );

  signIn = createEffect(() =>
    this.actions.pipe(
      ofType(SignInActions.signIn),
      switchMap(({ params }) => {
        return this.authService.signin(params).pipe(
          map((response: any) => {
            const accessTokenValue = response.data.access_token;
            const refreshTokenValue = response.data.refresh_token;

            const cookieAccessTokenString =
              'access_token=' +
              encodeURIComponent(accessTokenValue) +
              '; domain=.mfry.io; expires=' +
              +'; path=/';

            document.cookie = cookieAccessTokenString;

            this.cookieService.set(
              'access_token',
              accessTokenValue,
              undefined,
              '/',
              environment.cookieDomain,
              true
            );
            this.cookieService.set(
              'refresh_token',
              refreshTokenValue,
              undefined,
              '/',
              environment.cookieDomain,
              true
            );

            return SignInActions.signInSuccess();
          }),
          catchError((error) => of(SignInActions.signInFailure(error)))
        );
      })
    )
  );

  forgotPassword = createEffect(() =>
    this.actions.pipe(
      ofType(ForgotPasswordActions.forgotPassword),
      switchMap(({ email }) => {
        return this.authService.forgotPassword({ email }).pipe(
          map(() => ForgotPasswordActions.forgotPasswordSuccess()),
          catchError((error) =>
            of(ForgotPasswordActions.forgotPasswordFailure(error))
          )
        );
      })
    )
  );

  resetPassword = createEffect(() =>
    this.actions.pipe(
      ofType(ResetPasswordActions.resetPassword),
      switchMap(({ token, password }) => {
        return this.authService.resetPassword({ password, token }).pipe(
          map(() => ResetPasswordActions.resetPasswordSuccess()),
          catchError((error) =>
            of(ResetPasswordActions.resetPasswordFailure(error))
          )
        );
      })
    )
  );

  verify = createEffect(() =>
    this.actions.pipe(
      ofType(VerifyActions.verify),
      switchMap(({ token }) => {
        return this.authService.verify({ token }).pipe(
          map((response: any) => {
            const accessTokenValue = response.data.access_token;
            const refreshTokenValue = response.data.refresh_token;

            const cookieAccessTokenString =
              'access_token=' +
              encodeURIComponent(accessTokenValue) +
              '; domain=.mfry.io; expires=' +
              +'; path=/';

            document.cookie = cookieAccessTokenString;

            this.cookieService.set(
              'access_token',
              accessTokenValue,
              undefined,
              '/',
              environment.cookieDomain,
              true
            );
            this.cookieService.set(
              'refresh_token',
              refreshTokenValue,
              undefined,
              '/',
              environment.cookieDomain,
              true
            );

            return VerifyActions.verifySuccess();
          }),
          catchError((error) => of(VerifyActions.verifyFailure(error)))
        );
      })
    )
  );

  generateToken = createEffect(() =>
    this.actions.pipe(
      ofType(GenerateTokenActions.generateToken),
      switchMap(({ email }) => {
        return this.authService.generateToken({ email }).pipe(
          map(() => GenerateTokenActions.generateTokenSuccess()),
          catchError((error) =>
            of(GenerateTokenActions.generateTokenFailure(error))
          )
        );
      })
    )
  );
}
