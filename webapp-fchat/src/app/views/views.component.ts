import { Component, OnInit } from '@angular/core';
import { UserFacade } from '../stores/user/user.facade';
import { Observable, combineLatest, filter, firstValueFrom } from 'rxjs';
import { User } from '@library_v2/interfaces/user';
import { MessageFacade } from '../stores/message/message.facade';
import { RightAction, ViewsService } from './views.service';
import { MessageService } from '../stores/message/message.services';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit{

  constructor(
    private userFacade: UserFacade,
    private messageFacade: MessageFacade,
    private messageService: MessageService,
    private viewsService: ViewsService
  ){}

  showRightComponent$ = this.viewsService.showRightComponent$
  rightAction = RightAction

  users$: Observable<User> | undefined;
  viewsModel$ = combineLatest({
    users: this.userFacade.usersToSendMessages$.pipe(filter(users => !!users)),
    currentUser: this.userFacade.currentUser$.pipe(filter(user => !!user)),
    conversations: this.messageFacade.messages$.pipe(filter(messages => !!messages)),
    hasConversationSelected: this.messageFacade.hasConversationSelected$
  })

  async ngOnInit() {
    const {currentUser} = await firstValueFrom(this.viewsModel$.pipe(filter(vm => !!vm)))
    this.messageService.getMessageNotification(currentUser?.id!).subscribe(msg => {
      if(msg){
        this.messageFacade.notifyNewMessage(msg)
        this.playAudio()
      }
    })
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "/assets/sound.mp3";
    audio.load();
    audio.play();
  }

}