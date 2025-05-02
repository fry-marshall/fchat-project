import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { globalErrorMsg } from '@library_v2/interfaces/error';
import { Actions } from '@ngrx/effects';
import { plainToClass } from 'class-transformer';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthFacade } from 'src/app/stores/auth/auth.facade';
import { SignUpDto } from './sign-up.dto';
import { validate } from 'class-validator';
import { SignUpActions } from 'src/app/stores/auth/auth.actions';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: false,
})
export class SignUpComponent {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error = {
    hasError: false,
    msg: { title: '', subtitle: '' },
  };
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  };
  formSignUp: FormGroup = new FormGroup({
    fullname: new FormControl('Marshall FRY', [Validators.required]),
    email: new FormControl('marshalfry1998@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('Marshal1998', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('Marshal1998', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(private authFacade: AuthFacade, private actions$: Actions) {}

  get fullname() {
    return this.formSignUp.get('fullname');
  }
  get email() {
    return this.formSignUp.get('email');
  }
  get password() {
    return this.formSignUp.get('password');
  }
  get confirmPassword() {
    return this.formSignUp.get('confirmPassword');
  }

  async onSubmit() {
    const formValues = this.formSignUp.value;

    const signUpDto = plainToClass(SignUpDto, formValues);

    const errors = await validate(signUpDto);

    if (errors.length > 0) {
      this.handleValidationErrors(errors);
    } else {
      if (this.confirmPassword?.value !== this.password?.value) {
        this.formSignUp.controls['confirmPassword'].setErrors({
          confirmPassword: 'Passwords must be equal',
        });
      } else {
        this.submitForm();
      }
    }
  }

  handleValidationErrors(errors: any[]) {
    errors.forEach((error) => {
      const control = this.formSignUp.get(error.property);
      if (control) {
        control.setErrors({
          [error.property]:
            error.constraints[Object.keys(error.constraints)[0]],
        });
      }
    });
  }

  getControlError(property: string) {
    const control = this.formSignUp.get(property);
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
      fullname: this.fullname?.value,
      email: this.email?.value,
      password: this.password?.value,
    };

    const action = await firstValueFrom(this.authFacade.signUp(body));
    if (action.type === SignUpActions.signUpSuccess.type) {
      this.success.isSuccess = true;
      this.success.msg = {
        title: 'Success',
        subtitle:
          "Your account has been created successfully. \n You'll receive an email to activate it.",
      };
      this.formSignUp.reset();
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(false);
      }
    } else if (action.type === SignUpActions.signUpFailure.type) {
      this.error.hasError = true;
      this.error.msg = globalErrorMsg(action.errors);
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(true);
      }
    }
  }
}
