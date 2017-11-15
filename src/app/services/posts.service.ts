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

  private posts: Observable<Post[]>;
  private postsCollection: AngularFirestoreCollection<Post>;
  private postDoc: AngularFirestoreDocument<Post>;

  constructor(private afs: AngularFirestore) {
    this.retrievePosts();
  }

  private retrievePosts() {
    this.postsCollection = this.afs.collection('posts', ref => {
      return ref.orderBy('date').limit(20);
      });
    this.posts = this.postsCollection.valueChanges();
  }

  public getPosts() {
    return this.posts;
  }

  public addPost(newPost) {
    // this.postDoc = this.afs.const AngularFirestoreDocument = new type(arguments);
    // this.postDoc.set({ title: 'Test title'});
    return null;
  }

}
