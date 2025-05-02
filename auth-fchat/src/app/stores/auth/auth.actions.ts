import { createActionGroup, props } from "@ngrx/store";

export const SignUpActions = createActionGroup({
    source: 'SignUp',
    events: {
      'Sign Up': props<{fullname?: string, email?: string, password?: string}>(),
      'Sign Up Success': props<{ page: number; offset: number }>(),
      'Sign Up Failure': (query: string) => ({ query }),
    },
  });