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
    this.cookieService.set('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MTQ3NWRlLTFmNmYtNGIzYy1hM2U2LTZmOTAwMDAzNGY0ZCIsImVtYWlsIjoiamlsaTk4OTkwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYzMTA3MjUsImV4cCI6MTc0NjMxNDMyNX0.OAcNAM6FB0l11VfHMNtwVrYOSF7Xpw9AEKUeX-7v_UY')
    await firstValueFrom(this.userFacade.getAllUsersInfos())
    await firstValueFrom(this.userFacade.getUser())
    await firstValueFrom(this.messageFacade.getAllUserMessages())
  }
  
}
