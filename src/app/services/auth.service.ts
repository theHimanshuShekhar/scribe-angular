import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface User {
  uid?: string;
  email?: string;
  userName?: string;
  displayName?: string;
  photoURL?: string;
  status?: string;
  joinDate?: any;
}

@Injectable()
export class AuthService {

  private updateData: User;

  user: Observable<User>;

  userCollection: AngularFirestoreCollection<User>;
  userObs: Observable<any>;

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

  getAuth() {
    return this.afAuth.auth;
  }


  getAuthState() {
    return this.afAuth.authState;
  }
  emailLogin(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.afs.doc('users/' + credential.user.uid).valueChanges().subscribe(
          user => {
          if (user) {
            this.router.navigateByUrl('/home');
          } else {
            this.afAuth.auth.signOut()
            .then(() => this.router.navigateByUrl('/signup'));
          }
        });
      });
  }

  register(userdata) {
    if (userdata.type === 'google') {
      this.googleRegister(userdata);
    }
    if (userdata.type === 'email') {
      this.emailRegister(userdata);
    }
  }

  private emailRegister(formdata) {
    this.afAuth.auth.createUserWithEmailAndPassword(formdata.email, formdata.password)
    .then(() => {
      this.getAuthState().subscribe(user => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: formdata.displayname,
            status: 'Hi, I am using Scribe',
            userName: formdata.username,
          };
          this.updateUserData(userData);
        }
      });
    });
  }

  private googleRegister(formdata) {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(credential => {
      const user = credential.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        status: 'Hi, I am using Scribe',
        userName: formdata.username,
      };
      this.updateUserData(userData);
    });
  }

  private updateUserData(user) {

    // check if user already exists
    this.userCollection = this.afs.collection('users', ref => ref.where('uid', '==', user.uid));
    this.userObs = this.userCollection.valueChanges();
    this.userObs.forEach( userobj => {
      console.log('Existing User logged in- ', userobj[0].userName);
    })
    .then(
      (success) => {
        this.router.navigateByUrl('/home');
      })
    .catch (
      (err) => {
        // setup user data in firestore on login
          console.log('New User login.\nSetting up user in database.');
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

          const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL ? user.photoURL : 'https://scribe-angular.firebaseapp.com/assets/images/default-profile.jpg',
            status: 'Hi, I am using Scribe',
            userName: user.userName,
            joinDate: firebase.firestore.FieldValue.serverTimestamp()
          };
          if (this.afAuth.auth.currentUser) {
            this.getAuth().currentUser.sendEmailVerification().then(() => {
              this.logout();
            });
          }
          return userRef.set(data);
        });
  }

  logout() {
    this.afAuth.auth.signOut().then(
      () => {
      console.log('User logged out successfully.');
      this.router.navigateByUrl('/login');
    });
  }

  updateUser(displayname, username, status) {
    const updateRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.currentUser.uid}`);
    this.updateData = {
      userName: username,
      status: status,
      displayName: displayname,
    };
    return updateRef.update(this.updateData);
  }

  updatePhotoURL(photourl) {
    const updateRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.currentUser.uid}`);
    this.updateData = {
      photoURL : photourl
    };
    return updateRef.update(this.updateData);
  }

  // Check if user is logged in or not
  checkNotLogin() {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.router.navigateByUrl('/home');
        }
      });
  }

  checkLogin() {
    this.afAuth.authState.subscribe(
      user => {
        if (!user) {
          this.router.navigateByUrl('/start');
        }
      });
  }
}
