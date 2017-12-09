import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { PostsService } from './../services/posts.service';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddPostComponent implements OnInit {

  public showAccount: boolean = false;
  private uid;
  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;

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

    
    this.uid = this.auth.getAuthState().subscribe( user => {
      if( user ) {
        this.uid = user.uid;
        this.itemDoc = this.afs.doc<any>('users/'+this.uid);
        this.item = this.itemDoc.valueChanges();
        this.item.forEach(user => {
          if(!user.userName || !user.displayName) {
            this.showAccount = true;
          }
        });
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
