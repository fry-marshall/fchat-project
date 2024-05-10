import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { globalErrorMsg } from '@library_v2/interfaces/error';
import { User } from '@library_v2/interfaces/user';
import { Actions, ofType } from '@ngrx/effects';
import { BehaviorSubject, Observable, combineLatest, firstValueFrom, map, of, take, tap } from 'rxjs';
import { UpdateUserAccountFailure, UpdateUserAccountSuccess, UpdateUserProfilImgFailure, UpdateUserProfilImgSuccess } from 'src/app/stores/user/user.actions';
import { UserFacade } from 'src/app/stores/user/user.facade';
import { RightAction, ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-update-profile-sidebar',
  templateUrl: './update-profile-sidebar.component.html',
  styleUrls: ['./update-profile-sidebar.component.scss']
})
export class UpdateProfileSidebarComponent implements OnInit{

  @Input() user: User;

  imageURL: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
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

  options = [
    "Afficher ma photo",
    "Prendre une photo",
    "Importer une photo"
  ]
  displayUploadPictureModal: boolean = false;

  @ViewChild('fileInput') fileInput: any;

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

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageURL = e.target?.result!;
      };
      reader.readAsDataURL(this.selectedFile);
      this.displayUploadPictureModal = true
    }
  }
  
  showConvList(){
    this.viewsService.updateShowRightComponent(RightAction.show_conversations)
  }

  actionSelected(option: string) {
    switch (option) {
      case this.options[0]:
        break;

      case this.options[1]:
        break;

      case this.options[2]:
        break;
    }
  }

  async uploadPicture(){
    this.isLoading.next(true)
    this.userFacade.updateUserProfileImg(this.selectedFile)

    await firstValueFrom(this.actions$.pipe(
      ofType(UpdateUserProfilImgFailure, UpdateUserProfilImgSuccess),
      take(1),
      tap(action => {
        if (action.type === UpdateUserProfilImgFailure.type) {
          this.error.hasError = true
          this.error.msg = globalErrorMsg(action.error)
          if (this.notificationComponent) {
            this.notificationComponent.setVisibility(true)
          }
        } else {
          this.success.isSuccess = true;
          this.success.msg = {
            title: 'Succès',
            subtitle: 'Votre photo de profile a été modifié avec succès.'
          }
          if (this.notificationComponent) {
            this.notificationComponent.setVisibility(false)
          }
        }
        this.isLoading.next(false)
        this.displayUploadPictureModal = false
      })
    ))
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