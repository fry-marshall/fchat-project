import { Injectable } from '@angular/core';
import { HttpService } from '@library_v2/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpService) {}

  signup(body: { fullname: string, email: string; password: string }) {
    return this.http.post('auth/signup', body);
  }

  signin(body: { email: string; password: string }) {
    return this.http.post('auth/signin', body);
  }

  verify(body: { token: string; }) {
    return this.http.post('auth/verify', body);
  }

  forgotPassword(body: { email: string }) {
    return this.http.post('auth/forgotpassword', body);
  }

  resetPassword(body: { token: string, password: string }) {
    return this.http.post('auth/resetpassword', body);
  }

  generateToken(body: { email: string }) {
    return this.http.post('auth/generatetoken', body);
  }
}
