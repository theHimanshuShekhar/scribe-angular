import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPageComponent implements OnInit {

  username: string;
  status: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  private update() {
    this.auth.updateUser(this.username, this.status)
    this.router.navigateByUrl('/home');
  }

}
