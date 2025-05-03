import { User } from '@library_v2/interfaces/user';

export interface UserState {
  user: Partial<User> | null;
  allUsers: Partial<User>[] | null;
  isLoading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  user: null,
  allUsers: null,
  isLoading: false,
  error: '',
};
