import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  isUser: boolean;
  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';

  ngOnInit() {
    this.isUser = false;
    this.getUserData();
  }
  sendTo(path) {
    if (path === 'profile') {
      this.router.navigateByUrl('user/' + this.userName);
    }
    if (path === 'home') {
      this.router.navigateByUrl('home');
    }
  }
  getUserData() {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          this.isUser = true;
          this.userService.retrieveUserDocument(user.uid).subscribe(
            userDoc => {
              this.displayName = userDoc.displayName;
              this.userName = userDoc.userName;
              this.photoURL = userDoc.photoURL;
            });
        }
      });
  }

  logout() {
    this.isUser = false;
    this.auth.logout();
  }
}
