import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('content') modalContent: ElementRef;

  error: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private titleService: Title,
    private modalService: NgbModal
  ) { }

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

  ngOnInit() {
    this.auth.checkNotLogin();
    this.titleService.setTitle('Login');
  }

  login(mode) {
    if (mode === 'google') {
      this.auth.googleLogin().then(() => {
        this.router.navigateByUrl('/home');
      });
    }
    if (mode === 'email') {
        this.auth.getAuth().signInWithEmailAndPassword(this.email.value, this.password.value)
        .then(() => {
          this.auth.getAuthState().subscribe(user => {
            if (user) {
              if (user.emailVerified) {
                this.router.navigateByUrl('/home');
              } else {
                this.auth.getAuth().currentUser.sendEmailVerification();
                this.auth.getAuth().signOut().then(() => this.open(this.modalContent));
              }
            }
          });
        })
        .catch(err => {
          if (err.code === 'auth/user-not-found') {
            this.error = 'No User with the given Email found.';
          }
          if (err.code === 'auth/wrong-password') {
            this.error = 'Password incorrect!';
          }
          if (err.code === 'auth/user-disabled') {
            this.error = 'User has been banned. Please contact the administrator.';
          }
        });
    }
  }

  open(content) {
    this.modalService.open(content);
  }

}
