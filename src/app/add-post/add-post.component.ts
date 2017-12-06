import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { PostsService } from './../services/posts.service';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddPostComponent implements OnInit {

  public 'body': string;
  private author: string;
  private pid: string;
  private imgURL: string;
  private likes: number;
  private newPost;

  constructor(
    private postService: PostsService,
    public auth: AuthService,
    private afs: AngularFirestore
  ) {
  }

  ngOnInit() {
    this.auth.getAuthState().subscribe( user => {
      if (user) {
        setTimeout(() => {
          this.postService.getAuthorData();
        }, 1000);
      }
    });
  }

  public addPost() {
    this.newPost = {
      body: this.body,
      date: firebase.firestore.FieldValue.serverTimestamp()
    };
    this.postService.addPost(this.newPost);
    this.body = '';
  }

}
