import { PostsService } from './../services/posts.service';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Input() userURL: string;
  @Input() showAvatar;
  @Input() type;
  @Input() id;

  buttonsClass = 'col-12 mt-2 d-none';
  textareaClass = 'form-control col-10';
  imgcontainerClass = 'col-2';
  addPostWrapper;
  containerStyle;
  route;

  // Post Data
  postBody;
  imgURL;

  constructor(
    private postService: PostsService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() {
    this.route = this.router.url.slice(1, 5);
    if (this.route === 'user') {
      this.textareaClass = 'form-control col-12 mx-1 my-2';
      this.imgcontainerClass = 'd-none';
      this.addPostWrapper = 'row mx-1 justify-content-center';
      this.containerStyle = 'rounded p-2 my-1 container-fluid';
    } else {
      this.imgcontainerClass = 'col-2 mx-0';
      this.textareaClass = 'form-control col-10';
      this.addPostWrapper = 'row mr-1 justify-content-center';
      this.containerStyle = 'rounded p-2 mb-1 container-fluid';
    }
    if (!this.userURL) {
      this.userURL = '../../assets/images/default-profile.jpg';
    }
  }

  expand() {
    this.buttonsClass = 'col-12 mt-2';
    if (this.route === 'user') {
      this.textareaClass = 'form-control col-12 expanded mx-1 my-2';
    } else {
      this.textareaClass = 'form-control col-10 expanded';
    }
  }
  contract() {
    this.buttonsClass = 'col-9 col-lg-12 mt-2 d-none';
    if (this.route === 'user') {
      this.textareaClass = 'form-control col-12 mx-1 my-2';
    } else {
      this.textareaClass = 'form-control col-10';
    }
  }

  addPost() {
    this.contract();
    if (!this.type) {
      if (this.postBody) {
        const newPost = {
          body: this.postBody,
          imgURL: this.imgURL ? this.imgURL : null
        };
        this.postService.addPost(newPost);
        this.postBody = null;
      }
    }
    if (this.type === 'group') {
      if (this.postBody) {
        const newPost = {
          body: this.postBody,
          imgURL: this.imgURL ? this.imgURL : null,
          to: this.id,
          type: 'group'
        };
        this.postService.addPost(newPost);
        this.postBody = null;
      }
    }
  }
}
