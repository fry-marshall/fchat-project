import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationComponent } from "@library_v2/components/molecules/notification/notification.component";
import { globalErrorMsg } from "@library_v2/interfaces/error";
import { User } from "@library_v2/interfaces/user";
import { Actions, ofType } from "@ngrx/effects";
import { BehaviorSubject, firstValueFrom, take, tap } from "rxjs";
import { CreateUserAccountSuccess, CreateUserAccountFailure } from "src/app/stores/user/user.actions";
import { UserFacade } from "src/app/stores/user/user.facade";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
    error = {
        hasError: false,
        msg: { title: '', subtitle: '' },
    }
    success = {
        isSuccess: false,
        msg: { title: '', subtitle: '' },
    }
    formSignUp: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })

    @ViewChild(NotificationComponent, { static: false })
    private notificationComponent!: NotificationComponent;

    constructor(
        private userFacade: UserFacade,
        private actions$: Actions
    ) { }

    get email() { return this.formSignUp.get('email'); }
    get password() { return this.formSignUp.get('password'); }
    get confirmPassword() { return this.formSignUp.get('confirmPassword'); }

    async signUpUser() {
        this.success.isSuccess = false;
        this.error.hasError = false;
        if (this.formSignUp.status === "INVALID") {

            if (!this.email?.value || this.email.value === '') {
                this.formSignUp.controls['email'].setErrors({
                    novalid: 'Champ obligatoire'
                })
            }

            if (!(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-z]{2,7})$/.test(this.email?.value))) {
                this.formSignUp.controls['email'].setErrors({
                    novalid: 'Adresse mail incorrecte'
                })
            }

            if (!this.password?.value || this.password.value === '') {
                this.formSignUp.controls['password'].setErrors({
                    novalid: 'Champ obligatoire'
                })
            } else {
                if (this.formSignUp.controls['password'].errors) {
                    this.formSignUp.controls['password'].setErrors({
                        novalid: 'Le mot de passe doit contenir au moins 8 caractères'
                    })
                }
            }

            if (!this.confirmPassword?.value || this.confirmPassword.value === '') {
                this.formSignUp.controls['confirmPassword'].setErrors({
                    novalid: 'Champ obligatoire'
                })
            } else {
                if (this.formSignUp.controls['confirmPassword'].errors) {
                    this.formSignUp.controls['confirmPassword'].setErrors({
                        novalid: 'Le mot de passe doit contenir au moins 8 caractères'
                    })
                }
            }

        }
        else {

            if (this.confirmPassword?.value !== this.password?.value) {
                this.formSignUp.controls['confirmPassword'].setErrors({
                    novalid: 'Les mots de passe ne sont pas égaux'
                })
            } else {
                // make request
                this.isLoading.next(true)
                const body: Partial<User> = {
                    email: this.email?.value,
                    password: this.password?.value,
                };

                this.userFacade.createUserAccount(body)

                await firstValueFrom(this.actions$.pipe(
                    ofType(CreateUserAccountSuccess, CreateUserAccountFailure),
                    take(1),
                    tap(action => {
                        if (action.type === CreateUserAccountFailure.type) {
                            this.error.hasError = true
                            this.error.msg = globalErrorMsg(action.error)
                            if (this.notificationComponent) {
                                this.notificationComponent.setVisibility(true)
                            }
                        } else {
                            this.success.isSuccess = true;
                            this.success.msg = {
                                title: 'Succès',
                                subtitle: 'Votre compte a été crée avec succès. \n Vous recevrez un mail afin de l\'activer.'
                            }
                            this.formSignUp.reset()
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