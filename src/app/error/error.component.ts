import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  @Input() error: string;
  message;
  errormsg;

  constructor() { }

  ngOnInit() {
    if (this.error === 'nogroup') {
      this.errormsg = 'Group not found';
      this.message = 'The group does not exist or the URL is incorrect.';
    }
    if (this.error === 'nouser') {
      this.errormsg = 'User not found';
      this.message = 'The user does not exist or the URL is incorrect.';
    }
    if (this.error === 'noprofile') {
      this.errormsg = 'Profile not found';
      this.message = 'The profile does not exist or the URL is incorrect.';
    }
    if (this.error === 'nopost') {
      this.errormsg = 'Post not found';
      this.message = 'The post does not exist or the URL is incorrect. The post may have been deleted.';
    }
    if (this.error === 'nogroup') {
      this.errormsg = 'Group not found';
      this.message = 'The group does not exist or the URL is incorrect.';
    }
  }
}
