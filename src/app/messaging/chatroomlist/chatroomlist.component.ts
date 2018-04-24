import { UserService } from './../../services/user.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MessagingComponent } from '../messaging.component';
import { ChatroomComponent } from '../chatroom/chatroom.component';
import { PlatformLocation } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';

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
  unread;

  modalRef;
  closeResult;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private location: PlatformLocation,
    private msgService: MessageService,
    private auth: AuthService
  ) {
    location.onPopState((event) => {
      // ensure that modal is opened
      if (this.modalRef !== undefined) {
          this.modalRef.close();
      }
    });
   }

  ngOnInit() {
    this.userService.retrieveUserDocumentFromID(this.room.uid).subscribe(user => {
      if (user) {
        this.roomName = user.displayName + '@' + user.userName;
        this.photoURL = user.photoURL;
        this.roomData = {
          displayName: user.displayName,
          userName: user.userName,
          rid: this.room.rid,
          photoURL: this.photoURL
        };
        this.getUnread();
      }
    });
  }

  getUnread() {
    this.auth.getAuthState().subscribe(curruser => {
      this.msgService.getChatroomFromRID(this.room.rid, curruser.uid).subscribe(roomDoc => {
        const roomdocument: any = roomDoc;
        this.unread = roomdocument.unread;
      });
    });
  }

  openChatroom() {
    this.modalRef = this.modalService.open(this.modalContent, {
      size: 'lg',
      windowClass: 'modal-style'
    });
    history.pushState(null, null, 'chatroom/' + this.room.rid);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.msgService.clearUnread(this.roomData.rid);
  }

  private getDismissReason(reason: any): string {
    history.back();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
