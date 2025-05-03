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
    await firstValueFrom(this.userFacade.getAllUsersInfos())
    await firstValueFrom(this.userFacade.getUser())
    await firstValueFrom(this.messageFacade.getAllUserMessages())
  }
  
}
