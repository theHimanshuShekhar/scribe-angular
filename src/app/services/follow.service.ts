import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class FollowService {

  constructor(
    private afs: AngularFirestore
  ) { }

  isFollowing(profileuid, currentuid) {
    return this.afs.collection<any>('/users/' + profileuid + '/followers', ref => ref.where('uid', '==', currentuid)).valueChanges();
  }

}
