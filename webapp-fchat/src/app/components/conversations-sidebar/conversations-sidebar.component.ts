import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { User } from '@library_v2/interfaces/user';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MessageFacade } from 'src/app/stores/message/message.facade';
import { Conversation } from 'src/app/stores/message/message.interface';
import { UserFacade } from 'src/app/stores/user/user.facade';
import { RightAction, ViewsService } from 'src/app/views/views.service';
import { ChangePasswordDto } from './dto/changepassword.dto';
import {
  DeleteUserActions,
  LogOutActions,
  UpdateUserActions,
} from 'src/app/stores/user/user.actions';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Component({
  selector: 'app-conversations-sidebar',
  templateUrl: './conversations-sidebar.component.html',
  styleUrls: ['./conversations-sidebar.component.scss'],
  standalone: false,
})
export class ConversationsSidebarComponent implements OnChanges {
  @Input() conversations: Conversation[] = [];
  @Input() currentUser: Partial<User>;
  @Input() allUsers: Partial<User>[];

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  conversationFiltered: Conversation[] = this.conversations;
  filterUserName: string;
  options = [
    'Changer le mot de passe',
    'Se déconnecter',
    'Supprimer mon compte',
  ];
  displayChangePasswordModal = false;
  displayLogOutModal = false;
  displayDeleteAccountModal = false;
  error = {
    hasError: false,
    msg: { title: "Une erreur s'est produite", subtitle: '' },
  };
  success = {
    isSuccess: false,
    msg: { title: '', subtitle: '' },
  };

  formChangePassword: FormGroup = new FormGroup({
    new_password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirm_new_password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(
    private viewsService: ViewsService,
    private messageFacade: MessageFacade,
    private userFacade: UserFacade,
    private cookieService: CookieService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.conversationFiltered = this.conversations;
  }

  get newPassword() {
    return this.formChangePassword.get('new_password');
  }
  get confirmNewPassword() {
    return this.formChangePassword.get('confirm_new_password');
  }

  get profileImg() {
    const url =
      this.currentUser.profile_img !== null
        ? environment.assetsUrl + this.currentUser.profile_img
        : 'assets/default.png';
    return url;
  }

  showNewMessage() {
    this.viewsService.updateShowRightComponent(RightAction.new_message);
  }

  showUpdateProfile() {
    this.viewsService.updateShowRightComponent(RightAction.update_profile);
  }

  setCurrentConversation(conversation: Conversation) {
    this.messageFacade.setCurrentConversation(conversation);
    this.messageFacade.readMessages(
      conversation.conversation_id!,
      this.currentUser.id
    );
  }

  getUserInfos(conversation: Conversation) {
    return this.messageFacade.getUserInfos(
      conversation,
      this.currentUser,
      this.allUsers
    );
  }

  filterConversation() {
    if (this.filterUserName !== undefined) {
      this.conversationFiltered = this.conversations.filter((conv) => {
        return (
          this.getUserInfos(conv)?.fullname === null ||
          this.getUserInfos(conv)
            ?.fullname.toLocaleLowerCase()
            .includes(this.filterUserName.toLocaleLowerCase())
        );
      });
    } else {
      this.conversationFiltered = this.conversations;
    }
  }

  optionSelected(option: string) {
    switch (option) {
      case this.options[0]:
        this.displayChangePasswordModal = true;
        this.displayDeleteAccountModal = false;
        this.displayLogOutModal = false;
        break;

      case this.options[1]:
        this.displayChangePasswordModal = false;
        this.displayDeleteAccountModal = false;
        this.displayLogOutModal = true;
        break;

      case this.options[2]:
        this.displayChangePasswordModal = false;
        this.displayDeleteAccountModal = true;
        this.displayLogOutModal = false;
        break;
    }
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
    const control = this.formChangePassword.get(property);
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

  closeModal() {
    if (this.notificationComponent) {
      this.notificationComponent.setVisibility(false);
    }
    this.displayChangePasswordModal = false;
  }

  async changePassword() {
    const formValues = this.formChangePassword.value;

    const changePasswordDto = plainToClass(ChangePasswordDto, formValues);

    const errors = await validate(changePasswordDto);

    if (errors.length > 0) {
      this.handleValidationErrors(errors, this.formChangePassword);
    } else {
      if (this.confirmNewPassword?.value !== this.newPassword?.value) {
        this.formChangePassword.controls['confirm_new_password'].setErrors({
          confirm_new_password: 'Passwords must be equal',
        });
      } else {
        this.isLoading.next(true);
        const body = {
          password: this.newPassword?.value,
        };

        const action = await firstValueFrom(
          this.userFacade.updateUserAccount(body)
        );

        if (action.type === UpdateUserActions.updateUserSuccess.type) {
          this.success.isSuccess = true;
          this.success.msg = {
            title: 'Success',
            subtitle: 'Password changed successfully.',
          };
          this.formChangePassword.reset();
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
  }

  async deleteAccount() {
    this.isLoading.next(true);
    const action = await firstValueFrom(this.userFacade.deleteUser());

    if (action.type === DeleteUserActions.deleteUserFailure.type) {
      this.error.hasError = true;
      this.error.msg = {
        title: 'Error',
        subtitle: (action as any).message,
      };

      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(true);
      }
    } else if (action.type === DeleteUserActions.deleteUserSuccess.type) {
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(false);
      }
      this.cookieService.delete('access_token');
      this.cookieService.delete('refresh_token');
      window.location.href = environment.authUrl;
    }
  }

  async logOutUser() {
    this.isLoading.next(true);
    const action = await firstValueFrom(this.userFacade.logOutUser());

    if (action.type === LogOutActions.logOutSuccess.type) {
      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(false);
      }
      this.cookieService.delete('access_token');
      this.cookieService.delete('refresh_token');
      window.location.href = environment.authUrl;
    } else if (action.type === LogOutActions.logOutFailure.type) {
      this.error.hasError = true;
      this.error.msg = {
        title: 'Error',
        subtitle: (action as any).message,
      };

      if (this.notificationComponent) {
        this.notificationComponent.setVisibility(true);
      }
    }
  }
}
