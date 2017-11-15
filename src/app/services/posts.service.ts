import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostsService {

  posts: Observable<any[]>;

  constructor(private db: AngularFirestore) {
    this.retrievePosts();
  }

  private retrievePosts(){
    this.posts = this.db.collection('posts').valueChanges();
  }

  public getPosts() {
    return this.posts;
  }

}
