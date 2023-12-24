import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { NotificationComponent } from '@library_v2/components/molecules/notification/notification.component';
import { globalErrorMsg } from '@library_v2/interfaces/error';
import { User } from '@library_v2/interfaces/user';
import { Actions, ofType } from '@ngrx/effects';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, firstValueFrom, take, tap } from 'rxjs';
import { MessageFacade } from 'src/app/stores/message/message.facade';
import { Conversation } from 'src/app/stores/message/message.interface';
import { LogOutUserFailure, LogOutUserSuccess } from 'src/app/stores/user/user.actions';
import { UserFacade } from 'src/app/stores/user/user.facade';
import { ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-conversations-sidebar',
  templateUrl: './conversations-sidebar.component.html',
  styleUrls: ['./conversations-sidebar.component.scss']
})
export class ConversationsSidebarComponent {

  @Input() conversations: Conversation[] = [];
  @Input() currentUser: User;
  @Input() allUsers: User[];

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  conversationFiltered: Conversation[] = this.conversations;
  filterUserName: string
  options = [
    "Changer le mot de passe",
    "Se déconnecter",
    "Supprimer mon compte"
  ]
  displayChangePasswordModal = false;
  displayLogOutModal = false;
  displayDeleteAccountModal = false;
  error = {
    hasError: false,
    msg: { title: 'Une erreur s\'est produite', subtitle: '' },
  }

  formChangePassword: FormGroup = new FormGroup({
    old_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm_new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  @ViewChild(NotificationComponent, { static: false })
  private notificationComponent!: NotificationComponent;

  constructor(
    private viewsService: ViewsService,
    private messageFacade: MessageFacade,
    private userFacade: UserFacade,
    private actions$: Actions,
    private cookieService: CookieService
  ) { }

  get oldPassword() { return this.formChangePassword.get('old_password'); }
  get newPassword() { return this.formChangePassword.get('new_password'); }
  get confirmNewPassword() { return this.formChangePassword.get('confirm_new_password'); }

  showNewMessage() {
    this.viewsService.updateShowConvList(false)
  }

  setCurrentConversation(conversation: Conversation) {
    this.messageFacade.setCurrentConversation(conversation)
  }

  getUserInfos(conversation: Conversation) {
    return this.messageFacade.getUserInfos(conversation, this.currentUser, this.allUsers)
  }

  filterConversation() {
    this.conversationFiltered = this.conversations.filter(conv => this.getUserInfos(conv)?.fullname.includes(this.filterUserName) || this.getUserInfos(conv)?.fullname === null)
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

  changePassword() {

  }

  deleteAccount() {

  }

  async logOutUser() {
    this.isLoading.next(true)
    this.userFacade.logOutUser()

    await firstValueFrom(this.actions$.pipe(
      ofType(LogOutUserSuccess, LogOutUserFailure),
      take(1),
      tap(action => {
        if (action.type === LogOutUserFailure.type) {
          this.error.msg = globalErrorMsg(action.error)

          if (this.notificationComponent) {
            this.notificationComponent.setVisibility(true)
          }
        } else {
          if (this.notificationComponent) {
            this.notificationComponent.setVisibility(false)
          }
          this.cookieService.delete('access_token')
          this.cookieService.delete('refresh_token')
          window.location.href = environment.authUrl
        }
        this.isLoading.next(false)
      })
    ))
  }
}