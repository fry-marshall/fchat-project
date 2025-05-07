// socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor(private cookieService: CookieService) {
    const token = this.cookieService.get('access_token');
    console.log(environment.apiUrl)
    this.socket = io(environment.apiUrl, {
      transports: ['websocket'],
      auth: {
        token,
      },
      secure: true,
    });
  }

  listen<T>(event: string) {
    return new Observable<T>((subscriber) => {
      this.socket.on(event, (data: T) => subscriber.next(data));
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
