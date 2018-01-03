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
  userid: string;
  constructor(
    private msgService: MessageService,
    private auth: AuthService
  ) {
    this.auth.getAuthState().subscribe(user => {
      this.userid = user.uid;
      this.msgService.getMessageList(user.uid).subscribe((rooms) => {
        rooms.forEach(chatRoom => {
          this.msgService.getRoom(chatRoom.mid).subscribe(
            roomDet => {
              this.roomList.push(roomDet);
          });
        });
      });
    });
  }
}
