import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() modalRef;
  @Input() notif;
  user;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.retrieveUserDocumentFromID(this.notif.uid).subscribe(userDoc => this.user = userDoc);
  }

}
