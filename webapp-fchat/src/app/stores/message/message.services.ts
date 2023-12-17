import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@library_v2/interfaces/user';
import { HttpService } from '@library_v2/services/http.service';
import { Observable } from 'rxjs';
import { Message } from './message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpService,
  ) { }

  getAllMessages() {
    return this.http.get('message') as Observable<any>
  }

  sendNewMessage(body: Partial<Message>) {
    return this.http.post('message/send', body) as Observable<any>
  }

}