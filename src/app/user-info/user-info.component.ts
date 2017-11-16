import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {
  user = null;
  username: string = null;
  avatar: string = null;

  constructor(public auth: AuthService, public navbar: NavbarComponent, private router: Router) {

   }

  ngOnInit() {

  }

  public login() {
    this.auth.googleLogin();
    this.router.navigateByUrl('home');
  }

  public logout() {
    this.auth.logout();
    this.navbar.closeNavbar();
    this.router.navigateByUrl('home');
    this.avatar = null;
  }
}
