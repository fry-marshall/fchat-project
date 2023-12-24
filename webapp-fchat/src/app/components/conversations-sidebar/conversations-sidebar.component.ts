import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@library_v2/interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { MessageFacade } from 'src/app/stores/message/message.facade';
import { Conversation } from 'src/app/stores/message/message.interface';
import { ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-conversations-sidebar',
  templateUrl: './conversations-sidebar.component.html',
  styleUrls: ['./conversations-sidebar.component.scss']
})
export class ConversationsSidebarComponent{

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

  formChangePassword: FormGroup = new FormGroup({
    old_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm_new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  constructor(
    private viewsService: ViewsService,
    private messageFacade: MessageFacade
  ){}

  get oldPassword() { return this.formChangePassword.get('old_password'); }
  get newPassword() { return this.formChangePassword.get('new_password'); }
  get confirmNewPassword() { return this.formChangePassword.get('confirm_new_password'); }

  showNewMessage(){
    this.viewsService.updateShowConvList(false)
  }

  setCurrentConversation(conversation :Conversation){
    this.messageFacade.setCurrentConversation(conversation)
  }

  getUserInfos(conversation: Conversation){
    return this.messageFacade.getUserInfos(conversation, this.currentUser, this.allUsers)
  }

  filterConversation(){
    this.conversationFiltered = this.conversations.filter(conv => this.getUserInfos(conv)?.fullname.includes(this.filterUserName) || this.getUserInfos(conv)?.fullname === null)
  }

  optionSelected(option: string){
    switch(option){
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

  changePassword(){

  }

  deleteAccount(){

  }

  logOutUser(){

  }
}