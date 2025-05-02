import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SignUpActions = createActionGroup({
  source: 'SignUp',
  events: {
    'Sign Up': props<{
      params: { fullname: string; email: string; password: string };
    }>(),
    'Sign Up Success': props<{ msg: string }>(),
    'Sign Up Failure': props<{ errors: any }>(),
  },
});

export const SignInActions = createActionGroup({
  source: 'SignIn',
  events: {
    'Sign In': props<{ params: { email: string; password: string } }>(),
    'Sign In Success': emptyProps(),
    'Sign In Failure': props<{ errors: any }>(),
  },
});

export const VerifyActions = createActionGroup({
  source: 'Verify',
  events: {
    Verify: props<{ token: string }>(),
    'Verify Success': emptyProps(),
    'Verify Failure': props<{ errors: any }>(),
  },
});

export const ForgotPasswordActions = createActionGroup({
  source: 'Forgot Password',
  events: {
    'Forgot Password': props<{ email: string }>(),
    'Forgot Password Success': emptyProps(),
    'Forgot Password Failure': props<{ errors: any }>(),
  },
});

export const ResetPasswordActions = createActionGroup({
  source: 'Reset Password',
  events: {
    'Reset Password': props<{ token: string; password: string }>(),
    'Reset Password Success': emptyProps(),
    'Reset Password Failure': props<{ errors: any }>(),
  },
});

export const GenerateTokenActions = createActionGroup({
  source: 'Generate Token',
  events: {
    'Generate Token': props<{ email: string }>(),
    'Generate Token Success': emptyProps(),
    'Generate Token Failure': props<{ errors: any }>(),
  },
});
