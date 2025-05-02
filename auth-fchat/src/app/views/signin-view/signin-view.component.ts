import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { Actions } from '@ngrx/effects';
import { plainToClass } from 'class-transformer';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignInDto } from './signin.dto';
import { validate } from 'class-validator';
import { AuthFacade } from 'src/app/stores/auth/auth.facade';
import { SignInActions } from 'src/app/stores/auth/auth.actions';

@Component({
  selector: 'app-signin',
  templateUrl: './signin-view.component.html',
  styleUrls: ['./signin-view.component.scss'],
  standalone: false,
})
export class SignInViewComponent {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error = {
    hasError: false,
    msg: { title: "Une erreur s'est produite", subtitle: '' },
  };
  formSignIn: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(private authFacade: AuthFacade, private actions$: Actions) {}

  get email() {
    return this.formSignIn.get('email');
  }
  get password() {
    return this.formSignIn.get('password');
  }

  async onSubmit() {
    const formValues = this.formSignIn.value;

    const signUpDto = plainToClass(SignInDto, formValues);

    const errors = await validate(signUpDto);

    if (errors.length > 0) {
      this.handleValidationErrors(errors);
    } else {
      this.submitForm();
    }
  }

  handleValidationErrors(errors: any[]) {
    errors.forEach((error) => {
      const control = this.formSignIn.get(error.property);
      if (control) {
        control.setErrors({
          [error.property]:
            error.constraints[Object.keys(error.constraints)[0]],
        });
      }
    });
  }

  getControlError(property: string) {
    const control = this.formSignIn.get(property);
    const error = {
      is_error: false,
      error_msg: '',
    };

    if (typeof control?.errors?.[property] === 'string') {
      error.is_error = true;
      error.error_msg = control?.errors?.[property];
    }

    return error;
  }

  async submitForm() {
    this.isLoading.next(true);
    const body = {
      email: this.email?.value,
      password: this.password?.value,
    };

    const action = await firstValueFrom(this.authFacade.signIn(body));
    if (action.type === SignInActions.signInSuccess.type) {
      window.location.href = environment.appUrl;
    } else if (action.type === SignInActions.signInFailure.type) {
      this.error.hasError = true;
      this.error.msg = {
        title: 'Error',
        subtitle: (action as any).message,
      };
      switch ((action as any).status) {
        case 401:
          this.error.msg = {
            title: 'Error',
            subtitle: 'Email not verified',
          };
          break;
        case 404:
          this.error.msg = {
            title: 'Error',
            subtitle: 'Email or password incorrect',
          };
      }
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(true);
      }
    }
    this.isLoading.next(false);
  }
}
