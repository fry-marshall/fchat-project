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
    this.cookieService.set('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ1MjJmMTg0LTY3YzctNDUyZS1hZWU1LTgzOGZiYTAyMzhhZCIsImVtYWlsIjoibWFyc2hhbGZyeTE5OThAZ21haWwuY29tIiwiaWF0IjoxNzQ2Mjg0MzY4LCJleHAiOjE3NDYyODc5Njh9.vVonOCbStNfzaJvHJTpasYj7i1org4dlE48H6P0TFw0')
    this.cookieService.set('refresh_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MTQ3NWRlLTFmNmYtNGIzYy1hM2U2LTZmOTAwMDAzNGY0ZCIsImVtYWlsIjoiamlsaTk4OTkwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYyMzg4ODUsImV4cCI6MTc0Njg0MzY4NX0.nNTg3j4M9vn0h1ltVAk_QzALmgNpWSjbQ-kr7v0pIuk')
    await firstValueFrom(this.userFacade.getAllUsersInfos())
    await firstValueFrom(this.userFacade.getUser())
    await firstValueFrom(this.messageFacade.getAllUserMessages())
  }
  
}
