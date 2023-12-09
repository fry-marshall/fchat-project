import { Component, OnInit } from '@angular/core';
import { UserFacade } from '../stores/user/user.facade';
import { Observable, combineLatest, filter } from 'rxjs';
import { User } from '@library_v2/interfaces/user';
import { MessageFacade } from '../stores/message/message.facade';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit{

  constructor(
    private userFacade: UserFacade,
    private messageFacade: MessageFacade
  ){}

  users$: Observable<User> | undefined;
  viewsModel$ = combineLatest({
    users: this.userFacade.users$.pipe(filter(users => !!users)),
    conversations: this.messageFacade.messages$.pipe(filter(messages => !!messages))
  })

  async ngOnInit() {
    
  }

}