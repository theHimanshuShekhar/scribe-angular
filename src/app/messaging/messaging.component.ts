import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  chatrooms;

  constructor(
    private msgService: MessageService,
    private auth: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(curruser => {
      if (curruser) {
        this.msgService.getChatrooms(curruser.uid).subscribe(chatrooms => {
          this.chatrooms = chatrooms;
        });
      }
    });
  }

  getRoomDetails(uid) {
    this.userService.retrieveUserDocumentFromID(uid).subscribe(userDetails => {
      return userDetails.userName;
    });
  }

  createRoom() {

  }

}
