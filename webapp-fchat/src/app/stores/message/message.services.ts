import { Injectable } from '@angular/core';
import { HttpService } from '@library_v2/services/http.service';
import { Observable } from 'rxjs';
import { Message } from './message.interface';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpService,
    private socket: Socket,
  ) { }


  getMessageNotification(user_id: string){
    return this.socket.fromEvent(user_id)
  }

  getAllMessages() {
    return this.http.get('message') as Observable<any>
  }

  sendNewMessage(body: Partial<Message>) {
    return this.http.post('message/send', body) as Observable<any>
  }

  readMessage(conversation_id: string) {
    return this.http.put('message/read', {conversation_id}) as Observable<any>
  }

  getDate(date: string){
    const date_ = new Date(date);
    const hours = date_.getHours().toString()
    const minutes = date_.getMinutes().toString()
    return this.getRealDateValue(hours)+':'+this.getRealDateValue(minutes)
  }

  getRealDateValue(value: string){
    return value.length === 1 ? "0" + value : value
  }

}