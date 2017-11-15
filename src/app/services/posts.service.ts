import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';

interface Post {
  title: string;
  body: string;
  author: string;
}

interface NewPost {
  title: string;
  body: string;
  author: string;
  date;
  imgURL?: string;
  likes: number;
  'user-uid': string;
}

@Injectable()
export class PostsService {

  private posts: Observable<Post[]>;
  private postsCollection: AngularFirestoreCollection<Post>;
  private postDoc: AngularFirestoreDocument<Post>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService) {
    this.retrievePosts();
  }

  private retrievePosts() {
    this.postsCollection = this.afs.collection('posts', ref => {
      return ref.orderBy('date', 'desc').limit(20);
      });
    this.posts = this.postsCollection.valueChanges();
  }

  public getPosts() {
    return this.posts;
  }

  public addPost(newPost) {

      const postRef = this.afs.collection('posts');

      const data: NewPost = {
        title: newPost.title,
        body: newPost.body,
        author: this.auth.getDisplayName(),
        date: newPost.date,
        imgURL: null,
        likes: 0,
        'user-uid': this.auth.getUid()
      };

      return postRef.add(data)
        .then(() => {
          console.log('Post Successful');
        });
    }
}
