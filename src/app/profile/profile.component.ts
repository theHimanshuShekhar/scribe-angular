import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private titleService: Title
  ) { }

  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  status;
  joinDate = 'May 2009';
  userid = null;
  bannerURL;

  showInvalid: boolean;
  isLoaded: boolean;

  getStyle() {
    if (this.bannerURL) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.bannerURL})`);
    }
  }

  ngOnInit() {
    this.isLoaded = false;
    this.titleService.setTitle('Profile');
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
          this.titleService.setTitle(this.displayName + ' @' + this.userName);
        } else {
          this.isLoaded = true;
          this.showInvalid = true;
        }
    });
  }

}
