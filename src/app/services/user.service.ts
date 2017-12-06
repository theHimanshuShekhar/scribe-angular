import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

interface User {
  uid?: string;
  email?: string;
  userName?: string;
  displayName?: string;
  photoURL?: string;
  status?: string;
}

@Injectable()
export class UserService {
  username: string;
  userCollection: AngularFirestoreCollection<any>;
  userObs: Observable<any>;
  user: any;

  private useruid: string;
  private photoURL: string;
  private status: string;
  private displayName: string;
  private userName: string;

  constructor(public auth: AuthService, private afs: AngularFirestore) { }

  getUserName(uid) {
    this.getUserDataFromUID(uid);
    return this.userName;
  }

  getUid(username) {
    this.getUserDataFromUsername(username);
    return this.useruid;
  }

  public getUserDataFromUID(uid) {
      // Retrieve user collection
      this.userCollection = this.afs.collection('users', ref => ref.where('uid', '==', uid));
      this.userObs = this.userCollection.valueChanges();
      this.userObs.forEach(user => {
        if (user) {
          this.user = user;
          this.useruid = this.user[0].uid;
          this.photoURL = this.user[0].photoURL;
          this.displayName = this.user[0].displayName;
          this.status = this.user[0].status;
          this.userName = this.user[0].userName;
        }
      });
  }

  public getUserDataFromUsername(username) {
    if  (username) {
      // Retrieve user collection
      this.userCollection = this.afs.collection('users', ref => ref.where('userName', '==', username));
      this.userObs = this.userCollection.valueChanges();
      this.userObs.forEach(user => {
        if (user) {
          this.user = user;
          this.useruid = this.user[0].uid;
          this.photoURL = this.user[0].photoURL;
          this.displayName = this.user[0].displayName;
          this.status = this.user[0].status;
        }
      })
      .then (user => {
        console.log('user retrieved');
      });
    }
  }

}
