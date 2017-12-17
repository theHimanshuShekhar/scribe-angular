import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-info-home',
  templateUrl: './user-info-home.component.html',
  styleUrls: ['./user-info-home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserInfoHomeComponent implements OnInit {

  userCollection: AngularFirestoreCollection<any>;
  userObs: Observable<any>;

  user: any;
  username: string;
  useruid: string;
  photoURL: string;
  displayname: string;
  status: string;

  constructor(
    private userService: UserService,
    public auth: AuthService,
    private afs: AngularFirestore,
    private router: Router
  ) {  }

  ngOnInit() {
    this.photoURL = '../../assets/images/default-profile.jpg';
    this.auth.getAuthState().subscribe(userobj => {
      if (userobj) {
        this.userObs = this.userService.getUser(userobj.uid);
        this.userObs.subscribe(user => {
          if (user) {
            this.username = user[0].userName;
            this.displayname = user[0].displayName;
            this.photoURL = user[0].photoURL;
          }
        });
      }
    });
  }
  log(action) {
    if (action === 'login') {
      this.login();
    }
    if (action === 'logout') {
      this.logout();
    }
  }
  login() {
    console.log('login');
    this.auth.googleLogin();
  }

  logout() {
    this.auth.logout();
  }
  redirectTo(path) {
    if (path === 'profile') {
      this.router.navigateByUrl('user/' + this.username);
    }
    if (path === 'account') {
      this.router.navigateByUrl('account');
    }
  }

}
