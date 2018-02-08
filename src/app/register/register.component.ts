import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernameValidators } from '../Validators/username.validators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private title: Title
  ) {}

  emailform = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      UsernameValidators.cannotContainSpace
    ]),
    displayname: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
    password: new FormControl('', Validators.required)
  });

  googleform = new FormGroup({
    googleusername: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      UsernameValidators.cannotContainSpace
    ])
  });

  get googleusername() {
    return this.googleform.get('googleusername');
  }
  get username() {
    return this.emailform.get('username');
  }
  get displayname() {
    return this.emailform.get('displayname');
  }
  get email() {
    return this.emailform.get('email');
  }

  ngOnInit() {
    this.title.setTitle('Signup');
  }

}
