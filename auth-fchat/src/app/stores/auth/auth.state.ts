import { User } from "@library_v2/interfaces/user";

export interface AuthState{
    user: User | null,
    isLoading: boolean,
    error: string | null;
}

export const initialAuthState: AuthState = {
    user: null,
    isLoading: false,
    error: '',
}