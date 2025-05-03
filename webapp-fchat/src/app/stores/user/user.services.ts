import { Injectable } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { HttpService } from '@library_v2/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpService  ) {}

  getAllUsers() {
    return this.http.get('users') as Observable<any>;
  }

  getUser() {
    return this.http.get('users/me') as Observable<any>;
  }

  logOutUser(refresh_token: string) {
    return this.http.post('auth/logout', {refresh_token});
  }

  deleteUser() {
    return this.http.delete('users/me');
  }

  updateUser(body: any) {
    const formData = new FormData();
    const keys = Object.keys(body)
    for(const key of keys){
      console.log(key)
      formData.append(key, body[key]);
    }
    return this.http.put('users/me', formData) as Observable<any>;
  }
}
