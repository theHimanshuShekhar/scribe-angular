import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountComponent implements OnInit {
  username: string;
  status: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  public update() {
    this.auth.updateUser(this.username, this.status)
    this.router.navigateByUrl('/home');
  }
}
