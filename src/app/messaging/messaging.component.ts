import { Observable } from 'rxjs/Observable';
import { MessageService } from './../services/message.service';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent {

  roomList: any[] = [];
  constructor(
    private msgService: MessageService,
    private auth: AuthService
  ) {
    this.auth.getAuthState().subscribe(user => {
      this.msgService.getMessageList(user.uid).subscribe((rooms) => {
        const roomsLen = rooms.length;
        rooms.forEach(room => {
          this.roomList.push(room.mid);
        });
      });
    });
  }

  public getName(mid) {
    return 'Room Name- ' + mid;
  }
}
