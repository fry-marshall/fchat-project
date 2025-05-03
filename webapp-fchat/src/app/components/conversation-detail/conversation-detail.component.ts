import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@library_v2/interfaces/user';
import { combineLatest, filter, map } from 'rxjs';
import { MessageFacade } from 'src/app/stores/message/message.facade';
import { Message } from 'src/app/stores/message/message.interface';
import { UserFacade } from 'src/app/stores/user/user.facade';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.scss'],
  standalone: false,
})
export class ConversationDetailComponent implements OnInit, AfterViewInit {
  constructor(
    private messageFacade: MessageFacade,
    private userFacade: UserFacade
  ) {}

  viewModel$ = combineLatest({
    userInfos: this.messageFacade.receiverUserInfos$.pipe(
      filter((user) => !!user)
    ),
    messages: this.messageFacade.currentConversation$.pipe(
      filter((conv) => !!conv),
      map((conv) => conv?.messages.filter((msg) => msg.content !== ''))
    ),
    currentUser: this.userFacade.currentUser$.pipe(filter((user) => !!user)),
  });

  async ngOnInit() {}

  ngAfterViewInit() {
    document.getElementsByClassName('messages')[0].scrollTo({
      top: document.getElementsByClassName('messages')[0].scrollHeight,
      behavior: 'smooth',
    });
  }

  getFullName(fullname: string | undefined) {
    return fullname ?? 'Unknown fullname';
  }

  isSender(user: Partial<User>, message: Message) {
    return user.id === message.sender.id;
  }

  profileImg(user: Partial<User>) {
    const img = user?.profile_img ?? 'default.png'
    return environment.assetsUrl + img;
  }
}
