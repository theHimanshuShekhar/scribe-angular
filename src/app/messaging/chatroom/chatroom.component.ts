import { MessageService } from './../../services/message.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @Input() room;

  msgText;

  msgs;

  constructor(
    private msgService: MessageService
  ) { }

  ngOnInit() {
    this.msgService.getMessages(this.room.rid).subscribe(msgs => {
      if (msgs.length > 0) {
        this.msgs = msgs;
      }
    });
  }

  sendMsg() {
    if (this.msgText) {
      const data = {
        text: this.msgText,
        rid: this.room.rid
      };
      this.msgText = '';
      this.msgService.sendMessage(data);
    }
  }
}
