import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { globalErrorMsg } from '@library_v2/interfaces/error';
import { User } from '@library_v2/interfaces/user';
import { Actions, ofType } from '@ngrx/effects';
import { BehaviorSubject, Observable, combineLatest, firstValueFrom, map, of, take, tap } from 'rxjs';
import { UpdateUserAccountFailure, UpdateUserAccountSuccess } from 'src/app/stores/user/user.actions';
import { UserFacade } from 'src/app/stores/user/user.facade';
import { RightAction, ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-update-profile-sidebar',
  templateUrl: './update-profile-sidebar.component.html',
  styleUrls: ['./update-profile-sidebar.component.scss']
})
export class UpdateProfileSidebarComponent implements OnInit{

  @Input() user: User;

  formUpdateProfile = new FormGroup({
    fullname: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  error = {
    hasError: false,
    msg: { title: 'Une erreur s\'est produite', subtitle: '' },
  }
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  }

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  confirmButton: Observable<boolean>;

  constructor(
    private viewsService: ViewsService,
    private actions$: Actions,
    private userFacade: UserFacade
  ){}

  ngOnInit() {
    const data = {
      fullname: this.user.fullname,
      description: this.user.description
    }
    this.formUpdateProfile.patchValue(data)

    this.confirmButton = combineLatest([
      this.formUpdateProfile.valueChanges,
      of(data)
    ]).pipe(
      map(([value, data]) => {
        return value.description !== data.description || value.fullname !==data.fullname
      }),
    )
  }

  get fullname() { return this.formUpdateProfile.get('fullname'); }
  get description() { return this.formUpdateProfile.get('description'); }

  showConvList(){
    this.viewsService.updateShowRightComponent(RightAction.show_conversations)
  }

  async updateProfile() {
    if (this.formUpdateProfile.status === "INVALID") {

      if (!this.fullname?.value || this.fullname.value === '') {
        this.formUpdateProfile.controls['fullname'].setErrors({
          novalid: 'Champ obligatoire'
        })
      } 

      if (!this.description?.value || this.description.value === '') {
        this.formUpdateProfile.controls['description'].setErrors({
          novalid: 'Champ obligatoire'
        })
      } 
    }
    else {
      // make request
      this.isLoading.next(true)
      const body = {
        fullname: this.fullname?.value,
        description: this.description?.value
      };

      this.userFacade.updateUserAccount(body)

      await firstValueFrom(this.actions$.pipe(
        ofType(UpdateUserAccountFailure, UpdateUserAccountSuccess),
        take(1),
        tap(action => {
          if (action.type === UpdateUserAccountFailure.type) {
            this.error.hasError = true
            console.log(action.error)
            this.error.msg = globalErrorMsg(action.error)
            if (this.notificationComponent) {
              this.notificationComponent.setVisibility(true)
            }
          } else {
            this.success.isSuccess = true;
            this.success.msg = {
              title: 'Succès',
              subtitle: 'Votre profile a été modifié avec succès.'
            }
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