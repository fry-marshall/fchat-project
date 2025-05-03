import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from './user.services';
import { catchError, map, of, switchMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@environments/environment';
import { DeleteUserActions, GetAllUsersActions, GetUserActions, LogOutActions, UpdateUserActions } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  getAllUsers = createEffect(() =>
    this.actions$.pipe(
      ofType(GetAllUsersActions.getAllUsers),
      switchMap(() => {
        return this.userService.getAllUsers().pipe(
          map(({ data }) =>
            GetAllUsersActions.getAllUsersSuccess({
              users: data,
            })
          ),
          catchError((error) =>
            of(GetAllUsersActions.getAllUsersFailure(error))
          )
        );
      })
    )
  );

  getUser = createEffect(() =>
    this.actions$.pipe(
      ofType(GetUserActions.getUser),
      switchMap(() => {
        return this.userService.getUser().pipe(
          map(({ data }) =>
            GetUserActions.getUserSuccess({
              user: data,
            })
          ),
          catchError((error) =>
            of(GetUserActions.getUserFailure(error))
          )
        );
      })
    )
  );

  logOutUser = createEffect(() =>
    this.actions$.pipe(
      ofType(LogOutActions.logOut),
      switchMap(({refresh_token}) => {
        return this.userService.logOutUser(refresh_token).pipe(
          map(() => {
            this.cookieService.delete('access_token');
            this.cookieService.delete('refresh_token');
            window.location.href = environment.authUrl;
            return LogOutActions.logOutSuccess();
          }),
          catchError((error) => of(LogOutActions.logOutFailure(error)))
        );
      })
    )
  );

  deleteUser = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteUserActions.deleteUser),
      switchMap(() => {
        return this.userService.deleteUser().pipe(
          map(() => DeleteUserActions.deleteUserSuccess()),
          catchError((error) => of(DeleteUserActions.deleteUserFailure(error)))
        );
      })
    )
  );

  updateUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateUserActions.updateUser),
      switchMap(({ user }) => {
        return this.userService.updateUser(user).pipe(
          map(({data}) => UpdateUserActions.updateUserSuccess({ user: {...user, ...data.user} })),
          catchError((error) => of(UpdateUserActions.updateUserFailure(error)))
        );
      })
    )
  );

  /* updateUserProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.UpdateUserProfilImg),
      switchMap(({ profile_img }) => {
        return this.userService.updateUserProfileImg(profile_img).pipe(
          map((response: any) =>
            userActions.UpdateUserProfilImgSuccess({ img: response.data.img })
          ),
          catchError((error) =>
            of(userActions.UpdateUserProfilImgFailure(error))
          )
        );
      })
    )
  ); */
}
