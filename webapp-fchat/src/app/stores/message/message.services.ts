import { Injectable } from '@angular/core';
import { HttpService } from '@library_v2/services/http.service';
import { Observable } from 'rxjs';
import { SocketService } from 'src/app/socket.service';
import { Notification } from './message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpService,
    private socketService: SocketService,
  ) { }


  getMessageNotification(channel: string): Observable<any>{
    return this.socketService.listen(channel)
  }

  getallConversations() {
    return this.http.get('messages/me') as Observable<any>
  }

  sendNewMessage(body: {content: string, user_id: string}) {
    return this.http.post('messages/send', body) as Observable<any>
  }

  readMessage(conversation_id: string) {
    return this.http.put('messages/read', {conversation_id}) as Observable<any>
  }

  getDate(date_: string){
    const date = new Date(date_);
    const hours = date.getHours().toString()
    const minutes = date.getMinutes().toString()
    return this.getRealDateValue(hours)+':'+this.getRealDateValue(minutes)
  }

  getNormalDate(date: string){
    const date_ = new Date(date);
    const day = date_.getDate().toString()
    const month = date_.getMonth().toString()
    const year = date_.getFullYear().toString()
    return this.getRealDateValue(day)+'/'+this.getRealDateValue(month)+'/'+this.getRealDateValue(year)
  }

  isToday(date_: string){
    const today = new Date()
    const date = new Date(date_)
    return today.getDate() === date.getDate() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear()
  }

  isYesterday(date_: string){
    const today = new Date()
    const date = new Date(date_)
    return today.getDate() === (date.getDate() + 1) && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear()
  }

  getRealDateValue(value: string){
    return value.length === 1 ? "0" + value : value
  }

}