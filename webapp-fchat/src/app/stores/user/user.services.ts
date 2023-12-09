import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@library_v2/interfaces/user';
import { HttpService } from '@library_v2/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute
  ) { }

  getAllUsers() {
    return this.http.get('user') as Observable<any>
  }

  signUpUser(body: Partial<User>) {
    return this.http.post('user/create', body) as Observable<any>
  }

  logInUser(body: { login: string, password: string }) {
    return this.http.post('user/login', body)
  }

  logOutUser() {
    return this.http.post('user/logout')
  }

  forgotPassword(email: string) {
    return this.http.put('user/update/forgotpassword', { email })
  }

  resetPassword(password: string, confirm_password: string) {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token')
    return this.http.put('user/update/forgotpassword/change?token=' + token, { password, confirm_password })
  }

  verifyEmail() {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token')
    return this.http.put('user/update/verify/email?token=' + token, {})
  }

  deleteUser() {
    return this.http.delete('user/delete')
  }

  updateUser(body: Partial<User>) {
    return this.http.put('user/update', body) as Observable<any>
  }

  updateUserProfileImg(profile_img: any) {
    const formData = new FormData();
    formData.append("profile_img", profile_img);
    return this.http.put('user/update/profile_img', formData) as Observable<any>
  }

}