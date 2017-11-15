import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  status?: string;
  userURL?: string;
}

@Injectable()
export class AuthService {
  user: Observable<User>;

  private authState: Observable<firebase.User>;
  private currentUser: firebase.User = null;

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
      });
  }
  private updateUserData(user) {
    // setup user data in firestore on login

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const userURLarray = user.displayName.split(' ');
    let userUrl = '';
    for (let i = 0; i < userURLarray.length; i++) {
      if (i !== 0) {
        userUrl  = userUrl + '-';
      }
      userUrl  += userURLarray[i];
    }

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      userURL: userUrl,
      photoURL: user.photoURL,
      status: 'Hi, I am using Scribe'
    };

    return userRef.set(data);
  }
  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/home');
  }
}
