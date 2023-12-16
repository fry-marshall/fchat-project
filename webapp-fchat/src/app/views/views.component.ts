import { Component, OnInit } from '@angular/core';
import { UserFacade } from '../stores/user/user.facade';
import { Observable, combineLatest, filter } from 'rxjs';
import { User } from '@library_v2/interfaces/user';
import { MessageFacade } from '../stores/message/message.facade';
import { ViewsService } from './views.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit{

  constructor(
    private userFacade: UserFacade,
    private messageFacade: MessageFacade,
    private viewsService: ViewsService
  ){}

  isShowConvList$ = this.viewsService.showConvList$

  users$: Observable<User> | undefined;
  viewsModel$ = combineLatest({
    users: this.userFacade.usersToSendMessages$.pipe(filter(users => !!users)),
    conversations: this.messageFacade.messages$.pipe(filter(messages => !!messages)),
    hasConversationSelected: this.messageFacade.hasConversationSelected$
  })

  async ngOnInit() {
    
  }

}