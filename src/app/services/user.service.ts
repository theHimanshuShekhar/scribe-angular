import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  retrieveUserDocument(uid) {
    return this.afs.doc<any>('users/' + uid).valueChanges();
  }

  retrieveUserDocumentFromUsername(username) {
    return this.afs.collection('users', ref => ref.where('userName', '==', username)).valueChanges();
  }
  retrieveUserDocumentFromID(uid) {
    return this.afs.doc<any>('users/' + uid).valueChanges();
  }

  getUserGroups(uid) {
    return this.afs.collection('users/' + uid + '/groups', ref => ref.orderBy('last', 'desc')).valueChanges();
  }

  getSuggestedUsers() {
    return this.afs.collection('users', ref => ref.orderBy('totalFollowers', 'desc').limit(5)).valueChanges();
  }
}
