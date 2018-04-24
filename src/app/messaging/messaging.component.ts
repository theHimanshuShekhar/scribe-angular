import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
    private userService: UserService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Messaging');
    this.auth.getAuthState().subscribe(curruser => {
      if (curruser) {
        this.msgService.getChatrooms(curruser.uid).subscribe(chatrooms => {
          this.chatrooms = chatrooms;
        });
      } else {
        this.router.navigateByUrl('/start');
      }
    });
  }

  getRoomDetails(uid) {
    this.userService.retrieveUserDocumentFromID(uid).subscribe(userDetails => {
      return userDetails.userName;
    });
  }

}
