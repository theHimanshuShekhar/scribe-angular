import { Router } from '@angular/router';
import { MessageService } from './../../services/message.service';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @Input() room;
  @Input() modalRef;

  msgText;

  msgs;

  constructor(
    private msgService: MessageService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.room.displayName) {
      this.auth.getAuthState().subscribe(curruser => {
        if (curruser) {
          this.userService.retrieveUserDocumentFromID(this.room.uid).subscribe(user => {
            this.room = {
              displayName: user.displayName,
              userName: user.userName,
              rid: this.room.rid,
              photoURL: user.photoURL
            };
          });
        } else {
          this.router.navigateByUrl('home');
        }
      });
    }
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

  sendToProfile() {
    if (this.modalRef) {
      this.modalRef.close();
      this.router.navigateByUrl('user/' + this.room.userName);
    }
  }
}
