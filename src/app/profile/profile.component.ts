import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  status;
  joinDate = 'May 2009';
  userid = null;
  showInvalid: boolean;
  isLoaded: boolean;

  ngOnInit() {
    this.isLoaded = false;
    this.userService.retrieveUserDocumentFromUsername(this.router.url.slice(6)).subscribe(
      user => {
        if (user[0]) {
          const uservar: any = user[0];
          this.displayName = uservar.displayName;
          this.userName = uservar.userName;
          this.status = uservar.status;
          this.photoURL = uservar.photoURL;
          this.userid = uservar.uid;
          this.isLoaded = true;
        } else {
          this.isLoaded = true;
          this.showInvalid = true;
        }
    });
  }

}
