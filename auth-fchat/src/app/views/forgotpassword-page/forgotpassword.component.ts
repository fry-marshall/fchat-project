import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, firstValueFrom, take, tap } from "rxjs";
import { UserFacade } from "src/app/stores/user/user.facade";
import { Actions, ofType } from "@ngrx/effects";
import { ForgotPasswordUserFailure, ForgotPasswordUserSuccess } from "src/app/stores/user/user.actions";
import { globalErrorMsg } from "@library_v2/interfaces/error";
import { NotificationComponent } from "@library_v2/components/molecules/notification/notification.component";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  error = {
    hasError: false,
    msg: { title: '', subtitle: '' },
  }
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  }
  formForgotPassword: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(
    private userFacade: UserFacade,
    private actions$: Actions
  ) { }

  get email() { return this.formForgotPassword.get('email'); }

  async forgotUserPassword() {
    this.success.isSuccess = false;
    this.error.hasError = false;
    
    if (this.formForgotPassword.status === "INVALID") {

      if (!this.email?.value || this.email.value === '') {
        this.formForgotPassword.controls['email'].setErrors({
          novalid: 'Champ obligatoire'
        })
      } else{
        if (!(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-z]{2,7})$/.test(this.email?.value))) {
          this.formForgotPassword.controls['email'].setErrors({
            novalid: 'Adresse mail incorrecte'
          })
        }
      }

    }
    else {
      // make request

      this.isLoading.next(true)
      this.userFacade.forgotPasswordUser(this.email?.value)
 
      await firstValueFrom(this.actions$.pipe(
        ofType(ForgotPasswordUserSuccess, ForgotPasswordUserFailure),
        take(1),
        tap(action => {
          if (action.type === ForgotPasswordUserFailure.type) {
            this.error.hasError = true
            this.error.msg = globalErrorMsg(action.error)
            if (this.notificationComponent) {
              this.notificationComponent.setVisibility(true)
            }
          }else{
            this.success.isSuccess = true;
              this.success.msg = {
                title: 'Succès',
                subtitle: 'Un email vous a été envoyé afin de réinitialiser votre mot de passe.'
              }
            this.formForgotPassword.reset()
            if (this.notificationComponent) {
              this.notificationComponent.setVisibility(false)
            }
          }
          this.isLoading.next(false)
        })
      ))

    }
  }
}