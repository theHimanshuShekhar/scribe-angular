import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
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
  @Output() closeNavEvent = new EventEmitter<boolean>();

  constructor(public auth: AuthService, public navbar: NavbarComponent, private router: Router) {

  }

  ngOnInit() {

  }

  public login() {
    this.closeNavEvent.next(true);
    this.auth.googleLogin();
  }

  public logout() {
    this.auth.logout();
    this.avatar = null;
    this.closeNavEvent.next(true);
  }
}
