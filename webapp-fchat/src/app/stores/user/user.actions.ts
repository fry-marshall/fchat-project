import { User } from '@library_v2/interfaces/user';
import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';

export const GetAllUsersActions = createActionGroup({
  source: 'GetAllUsers',
  events: {
    'Get All Users': emptyProps(),
    'Get All Users Success': props<{ users: Partial<User>[] }>(),
    'Get All Users Failure': props<{ errors: any }>(),
  },
});

export const GetUserActions = createActionGroup({
  source: 'GetUser',
  events: {
    'Get User': emptyProps(),
    'Get User Success': props<{ user: Partial<User> }>(),
    'Get User Failure': props<{ errors: any }>(),
  },
});

export const LogOutActions = createActionGroup({
  source: 'LogOut',
  events: {
    'Log Out': props<{ refresh_token: string }>(),
    'Log Out Success': emptyProps(),
    'Log Out Failure': props<{ errors: any }>(),
  },
});

export const DeleteUserActions = createActionGroup({
  source: 'DeleteUser',
  events: {
    'Delete User': emptyProps(),
    'Delete User Success': emptyProps(),
    'Delete User Failure': props<{ errors: any }>(),
  },
});

export const UpdateUserActions = createActionGroup({
  source: 'UpdateUser',
  events: {
    'Update User': props<{ user: any }>(),
    'Update User Success': props<{ user: Partial<User> }>(),
    'Update User Failure': props<{ errors: any }>(),
  },
});
