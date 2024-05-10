import { Component, OnInit } from '@angular/core';
import { UserFacade } from '../stores/user/user.facade';
import { Observable, combineLatest, filter, firstValueFrom } from 'rxjs';
import { User } from '@library_v2/interfaces/user';
import { MessageFacade } from '../stores/message/message.facade';
import { RightAction, ViewsService } from './views.service';
import { MessageService } from '../stores/message/message.services';
import { animate, style, transition, trigger } from '@angular/animations';

export interface NotificationMessage {
  type?: string,
  data?: any
}

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss'],
  animations: [
    trigger('showSidebar', [
      transition(':enter', [
        style({
          transform: 'translateX(-100%)',
        }),
        animate('.5s', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0)'
        }),
        animate('.5s', style({ transform: 'translateX(-100%)' }))
      ]),
    ])
  ]
})
export class ViewsComponent implements OnInit {

  constructor(
    private userFacade: UserFacade,
    private messageFacade: MessageFacade,
    private messageService: MessageService,
    private viewsService: ViewsService
  ) { }

  showRightComponent$ = this.viewsService.showRightComponent$
  rightAction = RightAction

  isShown: boolean = false

  users$: Observable<User> | undefined;
  viewsModel$ = combineLatest({
    users: this.userFacade.usersToSendMessages$.pipe(filter(users => !!users)),
    currentUser: this.userFacade.currentUser$.pipe(filter(user => !!user)),
    conversations: this.messageFacade.messages$.pipe(filter(messages => !!messages)),
    hasConversationSelected: this.messageFacade.hasConversationSelected$
  })

  async ngOnInit() {
    const { currentUser } = await firstValueFrom(this.viewsModel$.pipe(filter(vm => !!vm)))
    this.messageService.getMessageNotification(currentUser?.id!).subscribe((notification: NotificationMessage) => {
      switch (notification.type) {
        case 'new_message':
          this.messageFacade.notifyNewMessage(notification.data)
          this.playAudio()
          document.getElementsByClassName('messages')[0].scrollTo({
            top: document.getElementsByClassName('messages')[0].scrollHeight,
            behavior: 'smooth'
          });
          break;
        case 'read_message':
          this.messageFacade.notifyReadMessage(notification.data)
          break
      }
    })
  }

  playAudio() {
    let audio = new Audio();
    audio.src = "/assets/sound.mp3";
    audio.load();
    audio.play();
  }

  show() {
    this.isShown = !this.isShown
  }

}