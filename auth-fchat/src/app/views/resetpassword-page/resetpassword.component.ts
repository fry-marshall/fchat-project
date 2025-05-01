import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, firstValueFrom, take, tap } from "rxjs";
import { UserFacade } from "src/app/stores/user/user.facade";
import { Actions, ofType } from "@ngrx/effects";
import { ResetPasswordUserFailure, ResetPasswordUserSuccess } from "src/app/stores/user/user.actions";
import { NotificationComponent } from "@library_v2/components/molecules/notification/notification.component";

@Component({
    selector: 'app-resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss'],
    standalone: false
})
export class ResetpasswordComponent {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  error = {
    hasError: false,
    msg: { title: 'Une erreur s\'est produite', subtitle: '' },
  }
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  }
  formResetPassword: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(
    private userFacade: UserFacade,
    private actions$: Actions
  ) { }

  get password() { return this.formResetPassword.get('password'); }
  get confirmPassword() { return this.formResetPassword.get('confirmPassword'); }

  async resetUserPassword() {
    if (this.formResetPassword.status === "INVALID") {
      console.log(this.formResetPassword)
      if (!this.password?.value || this.password.value === '') {
        this.formResetPassword.controls['password'].setErrors({
          novalid: 'Champ obligatoire'
        })
      } else{
        if(this.formResetPassword.controls['password'].errors){
          this.formResetPassword.controls['password'].setErrors({
            novalid: 'Le mot de passe doit contenir au moins 8 caractères'
          })
        }
      }

      if (!this.confirmPassword?.value || this.confirmPassword.value === '') {
        this.formResetPassword.controls['confirmPassword'].setErrors({
          novalid: 'Champ obligatoire'
        })
      } else{
        if(this.formResetPassword.controls['confirmPassword'].errors){
          this.formResetPassword.controls['confirmPassword'].setErrors({
            novalid: 'Le mot de passe doit contenir au moins 8 caractères'
          })
        }
      }

    }
    else {
      if (this.confirmPassword?.value !== this.password?.value) {
        this.formResetPassword.controls['confirmPassword'].setErrors({
          novalid: 'Les mots de passe ne sont pas égaux'
        })
      } else {
        // make request
        this.isLoading.next(true)
        this.userFacade.resetPasswordUser(this.password?.value, this.confirmPassword?.value)
        
        await firstValueFrom(this.actions$.pipe(
          ofType(ResetPasswordUserSuccess, ResetPasswordUserFailure),
          take(1),
          tap(action => {
            if (action.type === ResetPasswordUserFailure.type) {
              this.error.hasError = true
              this.error.msg.subtitle = 'La session a expiré.\nVeuillez refaire \"Oublier le mot de passe\" afin de pouvoir le réinitialiser.'
              if (this.notificationComponent) {
                this.notificationComponent.setVisibility(true)
              }
            }else{
              this.success.isSuccess = true;
              this.success.msg = {
                title: 'Succès',
                subtitle: 'Votre mot de passe a été réinitialisé avec succès.'
              }
              this.formResetPassword.reset()
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
}