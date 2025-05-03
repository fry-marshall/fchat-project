import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { User } from '@library_v2/interfaces/user';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  BehaviorSubject,
  Observable,
  firstValueFrom,
} from 'rxjs';
import { UserFacade } from 'src/app/stores/user/user.facade';
import { RightAction, ViewsService } from 'src/app/views/views.service';
import { ProfileDto } from './profile.dto';
import { UpdateUserActions } from 'src/app/stores/user/user.actions';

@Component({
  selector: 'app-update-profile-sidebar',
  templateUrl: './update-profile-sidebar.component.html',
  styleUrls: ['./update-profile-sidebar.component.scss'],
  standalone: false,
})
export class UpdateProfileSidebarComponent implements OnInit {
  @Input() user: Partial<User>;

  imageURL: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  formUpdateProfile = new FormGroup({
    fullname: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error = {
    hasError: false,
    msg: { title: "Une erreur s'est produite", subtitle: '' },
  };
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  };

  options = ['Afficher ma photo', 'Prendre une photo', 'Importer une photo'];
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
    private userFacade: UserFacade,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const data = {
      fullname: this.user.fullname,
      description: this.user.description,
    };
    this.formUpdateProfile.patchValue(data);
    this.formUpdateProfile.markAsPristine();
  }

  get fullname() {
    return this.formUpdateProfile.get('fullname');
  }
  get description() {
    return this.formUpdateProfile.get('description');
  }

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
      this.displayUploadPictureModal = true;
    }
  }

  showConvList() {
    this.viewsService.updateShowRightComponent(RightAction.show_conversations);
  }

  actionSelected(option: string) {
    switch (option) {
      case this.options[0]:
        this.displayUserPicture = true;
        break;

      case this.options[1]:
        this.startCamera();
        break;

      case this.options[2]:
        this.selectFile();
        break;
    }
    this.displayPictureModal = false;
  }

  handleValidationErrors(errors: any[], form: FormGroup) {
    errors.forEach((error) => {
      const control = form.get(error.property);
      if (control) {
        control.setErrors({
          [error.property]:
            error.constraints[Object.keys(error.constraints)[0]],
        });
      }
    });
  }

  getControlError(property: string) {
    const control = this.formUpdateProfile.get(property);
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

  async uploadPicture() {
    this.isLoading.next(true);
    const body = {
      profile_img: this.selectedFile,
    };
    const action = await firstValueFrom(
      this.userFacade.updateUserAccount(body)
    );

    if (action.type === UpdateUserActions.updateUserSuccess.type) {
      this.success.isSuccess = true;
      this.success.msg = {
        title: 'Success',
        subtitle: 'Profile picture updated successfully.',
      };
      this.formUpdateProfile.markAsPristine();
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(false);
      }
    } else if (action.type === UpdateUserActions.updateUserFailure.type) {
      this.error.hasError = true;
      this.error.msg = {
        title: 'Error',
        subtitle: (action as any).message,
      };
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(true);
      }
    }
    this.isLoading.next(false);
    this.displayUploadPictureModal = false;
    this.displayTakePictureModal = false;
  }

  async updateProfile() {
    const formValues = this.formUpdateProfile.value;

    const profileDto = plainToClass(ProfileDto, formValues);

    const errors = await validate(profileDto);

    if (errors.length > 0) {
      this.handleValidationErrors(errors, this.formUpdateProfile);
    } else {
      this.isLoading.next(true);
      const body = {
        fullname: this.fullname?.value,
        description: this.description?.value,
      };

      const action = await firstValueFrom(
        this.userFacade.updateUserAccount(body)
      );

      if (action.type === UpdateUserActions.updateUserSuccess.type) {
        this.success.isSuccess = true;
        this.success.msg = {
          title: 'Success',
          subtitle: 'Profile updated successfully.',
        };
        this.formUpdateProfile.markAsPristine();
        if (this.notificationComponent) {
          this.notificationComponent.setVisibility(false);
        }
      } else if (action.type === UpdateUserActions.updateUserFailure.type) {
        this.error.hasError = true;
        this.error.msg = {
          title: 'Error',
          subtitle: (action as any).message,
        };
        if (this.notificationComponent) {
          this.notificationComponent.setVisibility(true);
        }
      }
      this.isLoading.next(false);
    }
  }

  startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.displayTakePictureModal = true;

        setTimeout(() => {
          if (this.videoElement) {
            this.videoElement.nativeElement.srcObject = stream;
          }
        }, 100);

        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error("Erreur lors de l'accès à la caméra : ", error);
      });
  }

  async takePicture() {
    try {
      const context = this.canvas.nativeElement.getContext('2d');
      context.drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
      const blob = await this.convertCanvasToBlob();
      this.selectedFile = new File([blob], 'profile.jpg', {
        type: 'image/png',
      });

      this.videoElement.nativeElement.style.display = 'none';
      this.canvas.nativeElement.style.display = 'block';
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
    }
    this.turnOffCamera();
  }

  turnOffCamera() {
    const videoTracks =
      this.videoElement.nativeElement.srcObject.getVideoTracks();
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
    this.turnOffCamera();
  }

  get profileImg() {
    return environment.assetsUrl + this.user.profile_img;
  }
}
