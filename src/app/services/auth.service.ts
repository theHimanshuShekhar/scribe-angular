import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface User {
  uid?: string;
  email?: string;
  userName?: string;
  displayName?: string;
  photoURL?: string;
  status?: string;
}

@Injectable()
export class AuthService {
  user: Observable<User>;

  private authState: Observable<firebase.User>;
  private currentUser: firebase.User = null;

  private profileusername: string;
  private status: string;

  constructor(private afAuth: AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router) {

    /// Get User and Auth data
    this.authState = this.afAuth.authState;
    this.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });

    // Get Auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }


  getAuthState() {
    return this.authState;
  }
  getUid() {
    return this.currentUser.uid;
  }

  getDisplayName() {
    return this.currentUser.displayName;
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.router.navigateByUrl('/home');
    return this.oAuthLogin(provider);
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
        this.router.navigateByUrl('/account');
      });
  }
  private updateUserData(user) {

    // setup user data in firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      userName: null,
      status: 'Hi, I am using Scribe'
    };

    return userRef.set(data);
  }
  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/home');
  }
  updateUser(username, status) {
    const updateRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.currentUser.uid}`);

    const updateData: User = {
      userName: username,
      status: status,
    };

    return updateRef.update(updateData);
  }
}
