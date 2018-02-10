import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.auth.checkNotLogin();
    this.titleService.setTitle('Login');
  }

  emailform = new FormGroup({
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required
    ])
  });
  get email() {
    return this.emailform.get('email');
  }
  get password() {
    return this.emailform.get('password');
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
