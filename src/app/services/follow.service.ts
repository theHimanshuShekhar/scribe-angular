import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';

@Injectable()
export class FollowService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private userservice: UserService,
  ) { }

  isFollowing(profileuid, currentuid) {
    return this.afs.collection<any>('/users/' + profileuid + '/followers', ref => ref.where('uid', '==', currentuid)).valueChanges();
  }

  follow(profileuid) {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          const currentuid = user.uid;
          let data = {
            uid: profileuid
          };
          this.afs.collection<any>('/users/' + currentuid + '/following').doc(profileuid).set(data);
          this.changeTotalFollowing(currentuid, 'increment');
          data = {
            uid: currentuid
          };
          this.afs.collection<any>('/users/' + profileuid + '/followers').doc(currentuid).set(data);
          this.changeTotalFollowers(profileuid, 'increment');
        }
      });
  }
  changeTotalFollowers(uid, type) {
    let status = true;
    if (type === 'increment') {
      this.userservice.retrieveUserDocumentFromID(uid).subscribe(
        userDoc => {
          let data;
          if (userDoc.totalFollowers) {
            data = { totalFollowers: userDoc.totalFollowers + 1 };
          } else {
            data = { totalFollowers: 1 };
          }
          if (status) {
            this.afs.doc<any>('users/' + uid).update(data);
          }
          status = false;
        });
    }
    if (type === 'decrement') {
      this.userservice.retrieveUserDocumentFromID(uid).subscribe(
        userDoc => {
          let data;
          if (userDoc.totalFollowers) {
            data = { totalFollowers: userDoc.totalFollowers - 1 };
          } else {
            data = { totalFollowers: 1 };
          }
          if (status) {
            this.afs.doc<any>('users/' + uid).update(data);
          }
          status = false;
        });
    }
  }
  changeTotalFollowing(uid, type) {
    let status = true;
    if (type === 'increment') {
      this.userservice.retrieveUserDocumentFromID(uid).subscribe(
        userDoc => {
          let data;
          if (userDoc.totalFollowing) {
            data = { totalFollowing: userDoc.totalFollowing + 1 };
          } else {
            data = { totalFollowing: 1 };
          }
          if (status) {
            this.afs.doc<any>('users/' + uid).update(data);
            status = false;
          }
      });
    }
    if (type === 'decrement') {
      this.userservice.retrieveUserDocumentFromID(uid).subscribe(
        userDoc => {
          let data;
          if (userDoc.totalFollowing) {
            data = { totalFollowing: userDoc.totalFollowing - 1 };
          } else {
            data = { totalFollowing: 1 };
          }
          if (status) {
            this.afs.doc<any>('users/' + uid).update(data);
            status = false;
          }
      });
    }
  }

  unfollow(profileuid) {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          const currentuid = user.uid;
          this.afs.collection<any>('/users/' + currentuid + '/following').doc(profileuid).delete();
          this.changeTotalFollowing(currentuid, 'decrement');
          this.afs.collection<any>('/users/' + profileuid + '/followers').doc(currentuid).delete();
          this.changeTotalFollowers(profileuid, 'decrement');
        }
    });
  }

  getFollowing(uid) {
    return this.afs.collection<any>('/users/' + uid + '/following').valueChanges();
  }

  getFollowers(uid) {
    return this.afs.collection<any>('/users/' + uid + '/followers').valueChanges();
  }

}
