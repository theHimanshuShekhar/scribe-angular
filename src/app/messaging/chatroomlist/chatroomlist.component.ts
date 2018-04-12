import { UserService } from './../../services/user.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagingComponent } from '../messaging.component';
import { ChatroomComponent } from '../chatroom/chatroom.component';

@Component({
  selector: 'app-chatroomlist',
  templateUrl: './chatroomlist.component.html',
  styleUrls: ['./chatroomlist.component.css']
})
export class ChatroomlistComponent implements OnInit {

  @Input() room;
  @ViewChild('modalContainer') modalContent: ElementRef;

  roomName;
  photoURL;
  roomData;

  constructor(
    private userService: UserService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.userService.retrieveUserDocumentFromID(this.room.uid).subscribe(user => {
      this.roomName = user.displayName + '@' + user.userName;
      this.photoURL = user.photoURL;
      this.roomData = {
        displayName: user.displayName,
        userName: user.userName,
        rid: this.room.rid,
        photoURL: this.photoURL
      };
    });
  }

  openChatroom() {
    this.modalService.open(this.modalContent, {
      size: 'lg',
      windowClass: 'modal-style'
    });
  }

}
