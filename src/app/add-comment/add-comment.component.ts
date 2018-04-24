import { UploadService } from './../services/upload.service';
import { PostsService } from './../services/posts.service';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from 'angularfire2/firestore';

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

  // Image Data
  inputFile;
  filename;

  // Post Data
  postBody;
  imgURL;
  pid;

  @Input() showAvatar;

  constructor(
    private postService: PostsService,
    private sanitizer: DomSanitizer,
    private uploadService: UploadService,
    private afs: AngularFirestore
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
    if (this.postBody && this.inputFile.size < 2000000) {
      this.pid = this.afs.createId();
      const newPost = {
        body: this.postBody,
        type: 'comment',
        to: this.parentpid,
        imgURL: this.imgURL ? this.imgURL : null,
        pid: this.pid
      };
      this.uploadService.pushUpload(this.inputFile, 'post', this.pid);
      this.postService.addComment(newPost);
      this.postBody = null;
    }
  }

  processImage(event) {
    this.inputFile = event.target.files[0];
    this.filename = this.inputFile.name;
    if (this.inputFile.size > 2000000) {
      this.filename = 'Max Filesize 2Mb!';
    } else {
      if (this.filename.length > 20) {
        this.filename = this.filename.slice(0, 20) + '...' + this.filename.slice(this.filename.length - 3);
        console.log(this.filename);
      }
    }
  }
}
