import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Input() users: any;
  @Input() title: string;
  @Input() modalRef;

  constructor() { }

  ngOnInit() {
  }

}
