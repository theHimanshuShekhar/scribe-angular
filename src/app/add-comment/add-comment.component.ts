import { PostsService } from './../services/posts.service';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {

  @Input() parentpid;

  buttonsClass = 'col-12 mt-2 d-none';
  textareaClass = 'form-control col-10';
  imgcontainerClass = 'col-2';
  addPostWrapper;
  containerStyle;
  route;

  // Post Data
  postBody;
  imgURL;

  @Input() showAvatar;

  constructor(
    private postService: PostsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.textareaClass = 'form-control col-12 mx-1 my-2';
    this.addPostWrapper = 'row mx-1 justify-content-center';
    this.containerStyle = 'rounded p-0 my-1 container-fluid';
  }

  expand() {
    this.buttonsClass = 'col-12 mt-2 mx-0 px-0';
    this.textareaClass = 'form-control col-12 expanded mx-1 my-2';
  }
  contract() {
    this.buttonsClass = 'col-9 col-lg-12 mt-2 d-none';
    this.textareaClass = 'form-control col-12 mx-1 my-2';
  }

  addPost() {
    this.contract();
    if (this.postBody) {
      const newPost = {
        body: this.postBody,
        type: 'comment',
        to: this.parentpid,
        imgURL: this.imgURL ? this.imgURL : null
      };
      this.postService.addComment(newPost);
      this.postBody = null;
    }
  }
}
