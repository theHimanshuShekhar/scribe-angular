import { UserService } from './../../services/user.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() uid: string;

  username;
  displayname;
  photoURL;
  status;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.retrieveUserDocumentFromID(this.uid).subscribe(
      user => {
        this.username = user.userName;
        this.displayname = user.displayName;
        this.status = user.status;
        this.photoURL = user.photoURL;
    });
  }

}
