import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class PostsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public getUserPosts(userid) {
    return this.afs.collection('posts', ref => {
      return ref.where('useruid', '==', userid).orderBy('date', 'desc').limit(30);
    }).valueChanges();
  }
}
