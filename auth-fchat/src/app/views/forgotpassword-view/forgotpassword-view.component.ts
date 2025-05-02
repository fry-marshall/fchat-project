import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { ForgotPasswordDto } from './forgotpassword.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  ForgotPasswordActions,
} from 'src/app/stores/auth/auth.actions';
import { AuthFacade } from 'src/app/stores/auth/auth.facade';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword-view.component.html',
  styleUrls: ['./forgotpassword-view.component.scss'],
  standalone: false,
})
export class ForgotpasswordViewComponent {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error = {
    hasError: false,
    msg: { title: '', subtitle: '' },
  };
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  };
  formForgotPassword: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(private authFacade: AuthFacade, private actions$: Actions) {}

  get email() {
    return this.formForgotPassword.get('email');
  }

  async onSubmit() {
    const formValues = this.formForgotPassword.value;

    const forgotPasswordDto = plainToClass(ForgotPasswordDto, formValues);

    const errors = await validate(forgotPasswordDto);

    if (errors.length > 0) {
      this.handleValidationErrors(errors);
    } else {
      this.submitForm();
    }
  }

  handleValidationErrors(errors: any[]) {
    errors.forEach((error) => {
      const control = this.formForgotPassword.get(error.property);
      if (control) {
        control.setErrors({
          [error.property]:
            error.constraints[Object.keys(error.constraints)[0]],
        });
      }
    });
  }

  getControlError(property: string) {
    const control = this.formForgotPassword.get(property);
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

    const action = await firstValueFrom(
      this.authFacade.forgotPassword(this.email?.value)
    );
    if (action.type === ForgotPasswordActions.forgotPasswordSuccess.type) {
      this.success.isSuccess = true;
      this.success.msg = {
        title: 'Success',
        subtitle: 'You\'ve received an email to reset your password.',
      };
      this.formForgotPassword.reset();
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(false);
      }
    } else if (
      action.type === ForgotPasswordActions.forgotPasswordFailure.type
    ) {
      this.error.hasError = true;
      this.error.msg = {
        title: 'Error',
        subtitle: (action as any).message,
      };
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(true);
      }
    }
    this.isLoading.next(false);
  }
}
