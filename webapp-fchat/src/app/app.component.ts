import { Component, OnInit } from '@angular/core';
import { MessageFacade } from './stores/message/message.facade';
import { UserFacade } from './stores/user/user.facade';
import { firstValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {

   constructor(
    private userFacade: UserFacade,
    private messageFacade: MessageFacade,
    private cookieService: CookieService
  ){}

  async ngOnInit() {
    this.cookieService.set('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1YTdiNWY5LTFlMTItNDhlMi1hODk2LWNlZDhiYTcwZmQ3ZCIsImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20iLCJpYXQiOjE3NDY1Nzg3NDAsImV4cCI6MTc0NjU4MjM0MH0.je930yevneRI3lhSM0WOkkkPZfPYmPuccS3s8DeQ4DE')
    await firstValueFrom(this.userFacade.getAllUsersInfos())
    await firstValueFrom(this.userFacade.getUser())
    await firstValueFrom(this.messageFacade.getAllUserMessages())
  }
  
}
