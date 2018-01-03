import { Component, OnInit, Input } from '@angular/core';
import { UserService } from './../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  @Input() Room;

  constructor(
    private userService: UserService,
    private auth: AuthService,
  ) { }

  user;

  ngOnInit() {
    this.user = null;
    if (this.Room) {
      if (this.auth.getUid() === this.Room.user1) {
        this.getUser(this.Room.user2);
      } else {
        this.getUser(this.Room.user1);
      }
    }
  }

  getUser(uid) {
    this.userService.getUser(uid).subscribe(user => {
      this.user = user[0];
    });
  }
}
