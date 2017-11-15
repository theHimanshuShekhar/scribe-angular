import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddPostComponent implements OnInit {

  public auth;

  constructor() {
  }

  ngOnInit() {
  }

}
