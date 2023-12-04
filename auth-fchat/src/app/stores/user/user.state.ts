import { User } from "@library_v2/interfaces/user";

export interface UserState{
    user: User | null,
    isLoading: boolean,
    error: string | null;
}


export const initialUserState: UserState = {
    user: null,
    isLoading: false,
    error: '',
}