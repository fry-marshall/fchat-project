import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { ResetPasswordActions } from 'src/app/stores/auth/auth.actions';
import { AuthFacade } from 'src/app/stores/auth/auth.facade';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ResetPasswordDto } from './resetpassword.dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword-view.component.html',
  styleUrls: ['./resetpassword-view.component.scss'],
  standalone: false,
})
export class ResetpasswordViewComponent {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error = {
    hasError: false,
    msg: { title: "Une erreur s'est produite", subtitle: '' },
  };
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  };
  formResetPassword: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(
    private authFacade: AuthFacade,
    private actions$: Actions,
    private activatedRoute: ActivatedRoute
  ) {}

  get password() {
    return this.formResetPassword.get('password');
  }
  get confirmPassword() {
    return this.formResetPassword.get('confirmPassword');
  }

  async onSubmit() {
    const formValues = this.formResetPassword.value;

    const resetPasswordDto = plainToClass(ResetPasswordDto, formValues);

    const errors = await validate(resetPasswordDto);

    if (errors.length > 0) {
      this.handleValidationErrors(errors);
    } else {
      if (this.confirmPassword?.value !== this.password?.value) {
        this.formResetPassword.controls['confirmPassword'].setErrors({
          confirmPassword: 'Passwords must be equal',
        });
      } else {
        this.submitForm();
      }
    }
  }

  handleValidationErrors(errors: any[]) {
    errors.forEach((error) => {
      const control = this.formResetPassword.get(error.property);
      if (control) {
        control.setErrors({
          [error.property]:
            error.constraints[Object.keys(error.constraints)[0]],
        });
      }
    });
  }

  getControlError(property: string) {
    const control = this.formResetPassword.get(property);
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
    const token = this.activatedRoute.snapshot.queryParamMap.get('token') ?? ''

    const action = await firstValueFrom(
      this.authFacade.resetPassword(token, this.password?.value)
    );
    if (action.type === ResetPasswordActions.resetPasswordSuccess.type) {
      this.success.isSuccess = true;
      this.success.msg = {
        title: 'Success',
        subtitle: "Password reset successfully.",
      };
      this.formResetPassword.reset();
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(false);
      }
    } else if (action.type === ResetPasswordActions.resetPasswordFailure.type) {
      this.error.hasError = true;
      this.error.msg = {
        title: 'Error',
        subtitle: (action as any).message,
      };
      this.error.hasError = true;
      this.error.msg = {
        title: 'Error',
        subtitle: (action as any).message,
      };
      switch ((action as any).status) {
        case 400:
          this.error.msg = {
            title: 'Error',
            subtitle: 'Incorrect infos, retry...',
          };
          break;
        case 404:
          this.error.msg = {
            title: 'Error',
            subtitle: 'User not found',
          };
          break;
      }
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(true);
      }
    }
    this.isLoading.next(false);
  }
}
