import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private userService: UserService
  ) { }

  displayName = 'Display Name';
  userName = 'username'
  photoURL = '../../assets/images/default-profile.jpg';

  ngOnInit() {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
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
    this.auth.logout();
  }
}
