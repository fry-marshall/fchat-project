import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@library_v2/interfaces/user';

@Component({
  selector: 'app-user-profile-picture',
  templateUrl: './user-profile-picture.component.html',
  styleUrls: ['./user-profile-picture.component.scss']
})
export class UserProfilePictureComponent{

  @Input() user: User;

  get profileImg() {
    const url = (this.user.profile_img !== null) ? environment.apiUrl + 'assets/'+this.user.profile_img : 'assets/default.png'
    return url
  }
}