import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { AuthFacade } from 'src/app/stores/auth/auth.facade';
import { ActivatedRoute } from '@angular/router';
import { VerifyActions } from 'src/app/stores/auth/auth.actions';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail-view.component.html',
  styleUrls: ['./verifyemail-view.component.scss'],
  standalone: false,
})
export class VerifyEmailViewComponent implements OnInit {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  error = {
    hasError: false,
    msg: { title: "Une erreur s'est produite", subtitle: '' },
  };
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private actions$: Actions
  ) {}

  async ngOnInit() {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token') ?? '';
    const action = await firstValueFrom(this.authFacade.verify(token));

    if (action.type === VerifyActions.verifySuccess.type) {
      this.success.isSuccess = true;
      this.success.msg = {
        title: 'Success',
        subtitle: 'Email adress verified successfully.',
      };
    } else if (action.type === VerifyActions.verifyFailure.type) {
      this.error.hasError = true;
      this.error.msg.subtitle = (action as any).error.message;
    }
    this.isLoading.next(false);
  }
}
