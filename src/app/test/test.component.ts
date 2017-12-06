import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TestComponent implements OnInit {

  public username;
  public useruid;

  constructor(public userService: UserService) {

    this.username = this.userService.getUserName('sn2D2P3kiDMnRNiumRYJmyFydh13');
    this.useruid = this.userService.getUid('hshekhar');


    console.log(this.username);
    console.log(this.useruid);
  }

  ngOnInit() {

  }

}
