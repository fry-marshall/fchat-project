import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NotificationComponent } from "@library_v2/components/molecules/notification/notification.component";
import { globalErrorMsg } from "@library_v2/interfaces/error";
import { Actions, ofType } from "@ngrx/effects";
import { BehaviorSubject, firstValueFrom, take, tap } from "rxjs";
import { LogInUserFailure, LogInUserSuccess } from "src/app/stores/user/user.actions";
import { UserFacade } from "src/app/stores/user/user.facade";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  error = {
    hasError: false,
    msg: { title: 'Une erreur s\'est produite', subtitle: '' },
  }
  formLogIn: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(
    private userFacade: UserFacade,
    private actions$: Actions
  ) { }

  get login() { return this.formLogIn.get('login'); }
  get password() { return this.formLogIn.get('password'); }

  async logInUser() {
    if (this.formLogIn.status === "INVALID") {

      if (!this.login?.value || this.login.value === '') {
        this.formLogIn.controls['login'].setErrors({
          novalid: 'Champ obligatoire'
        })
      } else{
        if (!(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-z]{2,7})$/.test(this.login?.value))) {
          this.formLogIn.controls['login'].setErrors({
            novalid: 'Adresse mail incorrecte'
          })
        }
      }

      if (!this.password?.value || this.password.value === '') {
        this.formLogIn.controls['password'].setErrors({
          novalid: 'Champ obligatoire'
        })
      } else{
        if(this.formLogIn.controls['password'].errors){
          this.formLogIn.controls['password'].setErrors({
            novalid: 'Le mot de passe doit contenir au moins 8 caractères'
          })
        }
      }
    }
    else {
      // make request

      this.isLoading.next(true)
      this.userFacade.logInUser(this.login?.value, this.password?.value)

      await firstValueFrom(this.actions$.pipe(
        ofType(LogInUserSuccess, LogInUserFailure),
        take(1),
        tap(action => {
          if (action.type === LogInUserFailure.type) {
            this.error.hasError = true
            if (action.error.status === 'not_found') {
              this.error.msg.subtitle = "Email ou mot de passe incorrect."
            } else {
              this.error.msg = globalErrorMsg(action.error)
            }
            if (this.notificationComponent) {
              this.notificationComponent.setVisibility(true)
            }
          } else {
            this.formLogIn.reset()
            if (this.notificationComponent) {
              this.notificationComponent.setVisibility(false)
            }
            window.location.href = environment.appUrl
          }
          this.isLoading.next(false)
        })
      ))

    }
  }
}