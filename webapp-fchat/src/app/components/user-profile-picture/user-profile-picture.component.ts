import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@library_v2/interfaces/user';

@Component({
  selector: 'app-user-profile-picture',
  templateUrl: './user-profile-picture.component.html',
  styleUrls: ['./user-profile-picture.component.scss'],
  standalone: false,
})
export class UserProfilePictureComponent {
  @Input() user: Partial<User>;

  get profileImg() {
    const img = this.user?.profile_img ?? 'default.png'
    return environment.assetsUrl + img;
  }
}
