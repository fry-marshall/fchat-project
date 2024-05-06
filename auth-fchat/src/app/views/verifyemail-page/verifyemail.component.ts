import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, firstValueFrom, take, tap } from "rxjs";
import { UserFacade } from "src/app/stores/user/user.facade";
import { Actions, ofType } from "@ngrx/effects";
import { VerifyEmailUserFailure, VerifyEmailUserSuccess } from "src/app/stores/user/user.actions";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true)
  error = {
    hasError: false,
    msg: { title: 'Une erreur s\'est produite', subtitle: '' },
  }
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  }

  constructor(
    private userFacade: UserFacade,
    private actions$: Actions
  ) { }

  async ngOnInit() {
    this.userFacade.verifyEmailUser()

    await firstValueFrom(this.actions$.pipe(
      ofType(VerifyEmailUserSuccess, VerifyEmailUserFailure),
      take(1),
      tap(action => {
        if (action.type === VerifyEmailUserFailure.type) {
          this.error.hasError = true
          if (action.error.errors?.status === "verified") {
            this.error.msg.subtitle = 'L\'adresse mail a déjà été verifiée.'
          } else {
            this.error.msg.subtitle = 'La session a expiré.\nVeuillez vous connecter afin de renvoyer un mail de vérification.\"'
          }

        } else {
          this.success.isSuccess = true;
          this.success.msg = {
            title: 'Succès',
            subtitle: 'Votre mot de passe a été vérifié avec succès.'
          }
        }
        this.isLoading.next(false)
      })
    ))
  }
}