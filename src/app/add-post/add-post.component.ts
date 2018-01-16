import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Input() userURL: string;

  buttonsClass = 'col-12 mt-2 d-none';
  textareaClass = 'form-control col-10';
  imgcontainerClass = 'col-2';
  addPostWrapper;
  containerStyle;
  route;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() {
    this.route = this.router.url.slice(1, 5);
    if (this.route === 'user') {
      this.textareaClass = 'form-control col-12 mx-1 my-2';
      this.imgcontainerClass = 'd-none';
      this.addPostWrapper = 'row mx-1';
      this.containerStyle = 'rounded p-2 my-1';
    } else {
      this.textareaClass = 'form-control col-10';
      this.addPostWrapper = 'row mr-2';
      this.containerStyle = 'rounded p-2 mb-1';
    }
    if (!this.userURL) {
      this.userURL = '../../assets/images/default-profile.jpg';
    }
  }

  expand() {
    this.buttonsClass = 'col-12 mt-2';
    if (this.route === 'user') {
      this.textareaClass = 'form-control col-11 expanded mr-0 ml-3';
    } else {
      this.textareaClass = 'form-control col-10 expanded';
    }
    console.log('expand');
  }
  contract() {
    this.buttonsClass = 'col-9 col-lg-12 mt-2 d-none';
    if (this.route === 'user') {
      this.textareaClass = 'form-control col-12 mx-1 my-2';
    } else {
      this.textareaClass = 'form-control col-10';
      this.imgcontainerClass = 'col-2';
    }
  }

}
