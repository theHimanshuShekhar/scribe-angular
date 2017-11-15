import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Post {
  title: string;
  body: string;
  author: string;
  id?: string;
}

@Injectable()
export class PostsService {

  private postsCollection: AngularFirestoreCollection<Post>;
  private posts: Observable<Post[]>;

  constructor(private afs: AngularFirestore) {
    this.retrievePosts();
  }

  private retrievePosts() {
    this.postsCollection = this.afs.collection('posts');
    this.posts = this.postsCollection.valueChanges();
  }

  public getPosts() {
    return this.posts;
  }

}
