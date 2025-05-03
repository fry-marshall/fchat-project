import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { AppState } from '../app.state';
import {
  getCurrentUser,
  getUsers,
  getUsersToSendMessages,
} from './user.selector';
import {
  DeleteUserActions,
  GetAllUsersActions,
  GetUserActions,
  LogOutActions,
  UpdateUserActions,
} from './user.actions';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  constructor(
    protected store: Store<AppState>,
    protected actions$: Actions,
    private cookieService: CookieService
  ) {}

  users$ = this.store.select(getUsers);
  usersToSendMessages$ = this.store.select(getUsersToSendMessages);
  currentUser$ = this.store.select(getCurrentUser);

  getAllUsersInfos() {
    this.store.dispatch(GetAllUsersActions.getAllUsers());

    return this.actions$.pipe(
      ofType(
        GetAllUsersActions.getAllUsersSuccess,
        GetAllUsersActions.getAllUsersFailure
      ),
      take(1)
    );
  }

  getUser() {
    this.store.dispatch(GetUserActions.getUser());

    return this.actions$.pipe(
      ofType(GetUserActions.getUserSuccess, GetUserActions.getUserFailure),
      take(1)
    );
  }

  logOutUser() {
    const refresh_token = this.cookieService.get('refresh_token');
    this.store.dispatch(LogOutActions.logOut({ refresh_token }));

    return this.actions$.pipe(
      ofType(LogOutActions.logOutSuccess, LogOutActions.logOutFailure),
      take(1)
    );
  }

  deleteUser() {
    this.store.dispatch(DeleteUserActions.deleteUser());

    return this.actions$.pipe(
      ofType(
        DeleteUserActions.deleteUserFailure,
        DeleteUserActions.deleteUserSuccess
      ),
      take(1)
    );
  }

  updateUserAccount(user: any) {
    this.store.dispatch(UpdateUserActions.updateUser({ user }));

    return this.actions$.pipe(
      ofType(
        UpdateUserActions.updateUserSuccess,
        UpdateUserActions.updateUserFailure
      ),
      take(1)
    );
  }

  updateUserProfileImg(profile_img: any) {
    this.store.dispatch(
      UpdateUserActions.updateUser({ user: { profile_img } })
    );

    return this.actions$.pipe(
      ofType(
        UpdateUserActions.updateUserSuccess,
        UpdateUserActions.updateUserFailure
      ),
      take(1)
    );
  }
}
