import { Component, HostListener, OnInit } from '@angular/core';
import { UserFacade } from '../stores/user/user.facade';
import { Observable, combineLatest, filter, firstValueFrom } from 'rxjs';
import { User } from '@library_v2/interfaces/user';
import { MessageFacade } from '../stores/message/message.facade';
import { Notification } from '../stores/message/message.interface';
import { RightAction, ViewsService } from './views.service';
import { MessageService } from '../stores/message/message.services';
import { animate, style, transition, trigger } from '@angular/animations';

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
        animate('.5s', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0)',
        }),
        animate('.5s', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
  standalone: false,
})
export class ViewsComponent implements OnInit {
  constructor(
    private userFacade: UserFacade,
    private messageFacade: MessageFacade,
    private messageService: MessageService,
    private viewsService: ViewsService
  ) {}

  showRightComponent$ = this.viewsService.showRightComponent$;
  rightAction = RightAction;

  isShown: boolean = false;

  private audio: HTMLAudioElement | null = null;
  public audioEnabled = false;

  users$: Observable<User> | undefined;
  viewsModel$ = combineLatest({
    users: this.userFacade.usersToSendMessages$.pipe(
      filter((users) => !!users)
    ),
    currentUser: this.userFacade.currentUser$.pipe(filter((user) => !!user)),
    conversations: this.messageFacade.messages$.pipe(
      filter((messages) => !!messages)
    ),
    hasConversationSelected: this.messageFacade.hasConversationSelected$,
  });

  async ngOnInit() {
    const { currentUser } = await firstValueFrom(
      this.viewsModel$.pipe(filter((vm) => !!vm))
    );
    this.messageService
      .getMessageNotification('new_message')
      .subscribe((notification: Notification) => {
        this.messageFacade.notifyNewMessage(notification, currentUser.id);
        this.playAudio();
        document.getElementsByClassName('messages')[0].scrollTo({
          top: document.getElementsByClassName('messages')[0].scrollHeight,
          behavior: 'smooth',
        });
      });

    this.messageService
      .getMessageNotification('read_message')
      .subscribe((body: { conversation_id: string }) => {
        this.messageFacade.notifyReadMessage(
          body.conversation_id,
          currentUser.id
        );
      });
  }

  @HostListener('document:click')
  enableAudio() {
    this.audio = new Audio('/assets/sound.mp3');
    this.audio.load();
    this.audio.volume = 0;
    this.audio
      .play()
      .then(() => {
        this.audio?.pause();
        this.audio.currentTime = 0;
        this.audio.volume = 1;
        this.audioEnabled = true;
        console.log('Lecture audio autorisée');
      })
      .catch((err) => {
        console.warn('Audio bloqué :', err);
      });
  }

  playAudio() {
    if (this.audioEnabled && this.audio) {
      this.audio.currentTime = 0;
      this.audio
        .play()
        .catch((err) => console.warn('Erreur lecture audio :', err));
    }
  }

  show() {
    this.isShown = !this.isShown;
  }
}
