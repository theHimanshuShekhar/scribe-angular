import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  username: string = "Gotiyababa";
}
