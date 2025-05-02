import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { AppState } from '../app.state';
import {
  ForgotPasswordActions,
  GenerateTokenActions,
  ResetPasswordActions,
  SignInActions,
  SignUpActions,
  VerifyActions,
} from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  constructor(protected store: Store<AppState>, protected actions$: Actions) {}

  signUp(params: { fullname: string; email: string; password: string }) {
    this.store.dispatch(SignUpActions.signUp({ params }));

    return this.actions$.pipe(
      ofType(SignUpActions.signUpSuccess, SignUpActions.signUpFailure),
      take(1)
    );
  }

  signIn(params: { email: string; password: string }) {
    this.store.dispatch(SignInActions.signIn({ params }));

    return this.actions$.pipe(
      ofType(SignInActions.signInSuccess, SignInActions.signInFailure),
      take(1)
    );
  }

  forgotPassword(email: string) {
    this.store.dispatch(ForgotPasswordActions.forgotPassword({ email }));

    return this.actions$.pipe(
      ofType(
        ForgotPasswordActions.forgotPasswordSuccess,
        ForgotPasswordActions.forgotPasswordFailure
      ),
      take(1)
    );
  }

  resetPassword(token: string, password: string) {
    this.store.dispatch(
      ResetPasswordActions.resetPassword({ token, password })
    );

    return this.actions$.pipe(
      ofType(
        ResetPasswordActions.resetPasswordSuccess,
        ResetPasswordActions.resetPasswordFailure
      ),
      take(1)
    );
  }

  verify(token: string) {
    this.store.dispatch(VerifyActions.verify({ token }));

    return this.actions$.pipe(
      ofType(VerifyActions.verifySuccess, VerifyActions.verifyFailure),
      take(1)
    );
  }

  generateToken(email: string) {
    this.store.dispatch(GenerateTokenActions.generateToken({ email }));

    return this.actions$.pipe(
      ofType(
        GenerateTokenActions.generateTokenSuccess,
        GenerateTokenActions.generateTokenFailure
      ),
      take(1)
    );
  }
}
