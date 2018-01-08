import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }
  login(mode) {
    if (mode === 'google') {
      this.auth.googleLogin();
    } else {
      alert('Email login not implemented yet');
    }
  }

}
