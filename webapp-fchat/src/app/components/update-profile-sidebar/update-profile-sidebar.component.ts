import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
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
export class UpdateProfileSidebarComponent implements OnInit {

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
  displayTakePictureModal: boolean = false;
  displayUserPicture: boolean = false;
  displayPictureModal: boolean = false;


  @ViewChild('fileInput') fileInput: any;
  @ViewChild('video') videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  confirmButton: Observable<boolean>;

  constructor(
    private viewsService: ViewsService,
    private actions$: Actions,
    private userFacade: UserFacade,
    private cdr: ChangeDetectorRef
  ) { }

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
        return value.description !== data.description || value.fullname !== data.fullname
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

  showConvList() {
    this.viewsService.updateShowRightComponent(RightAction.show_conversations)
  }

  actionSelected(option: string) {
    switch (option) {
      case this.options[0]:
        this.displayUserPicture = true
        break;

      case this.options[1]:
        this.startCamera()
        break;

      case this.options[2]:
        this.selectFile()
        break;
    }
    this.displayPictureModal = false
  }

  async uploadPicture() {
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
        this.displayTakePictureModal = false
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

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.displayTakePictureModal = true;

        setTimeout(() => {
          if (this.videoElement) {
            this.videoElement.nativeElement.srcObject = stream;
          }
        }, 100)

        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Erreur lors de l\'accès à la caméra : ', error);
      });
  }

  async takePicture() {
    try {
      const context = this.canvas.nativeElement.getContext('2d');
      context.drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
      const blob = await this.convertCanvasToBlob();
      this.selectedFile = new File([blob], "profile.jpg", { type: "image/png" });

      this.videoElement.nativeElement.style.display = 'none'
      this.canvas.nativeElement.style.display = 'block'

    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
    }
    this.turnOffCamera()
  }

  turnOffCamera() {
    const videoTracks = this.videoElement.nativeElement.srcObject.getVideoTracks();
    videoTracks.forEach((track: any) => {
      track.stop();
    });
  }

  convertCanvasToBlob(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.canvas.nativeElement.toBlob((blob: any) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Erreur lors de la conversion du canvas en blob'));
        }
      }, 'image/png');
    });
  }

  closeTakePictureModal() {
    this.displayTakePictureModal = false; 
    this.selectedFile = null; 
    this.turnOffCamera()
  }

  get profileImg() {
    const url = (this.user.profile_img !== null) ? environment.apiUrl + 'assets/'+this.user.profile_img : 'assets/default.png'
    return url
  }

}