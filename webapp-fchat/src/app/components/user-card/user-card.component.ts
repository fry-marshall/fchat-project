import { Component, Input } from '@angular/core';
import { User } from '@library_v2/interfaces/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent{

  @Input() user: User;

  getFullName(fullname: string){
    return fullname ?? 'Unknown fullname'
  }

  getDescription(description: string){
    return description ?? 'No description'
  }
}