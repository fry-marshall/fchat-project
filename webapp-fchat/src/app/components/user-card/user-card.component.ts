import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@library_v2/interfaces/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: false,
})
export class UserCardComponent {
  @Input() user: Partial<User>;

  getFullName(fullname: string) {
    return fullname ?? 'Unknown fullname';
  }

  getDescription(description: string) {
    return description ?? 'No description';
  }

  get profileImg() {
    const url =
      this.user.profile_img !== null
        ? environment.apiUrl + 'assets/' + this.user.profile_img
        : 'assets/default.png';
    return url;
  }
}
