import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    
  ) { }

  ngOnInit() {
    this.auth.checkNotLogin();
  }

  login(mode) {
    if (mode === 'google') {
      this.auth.googleLogin().then(() => {
        this.router.navigateByUrl('/home');
      });
    } else {
      alert('Email login not implemented yet');
    }
  }

}
