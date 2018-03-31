import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';

interface Group {
  gname: string;
  gid: string;
  desc: string;
  createDate;
}

@Injectable()
export class GroupService {

  currentuser;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private auth: AuthService
  ) { }

  createGroup(data) {
    const gid = this.afs.createId();
    const GData = {
      gname: data.gname,
      desc: data.desc,
      createDate: firebase.firestore.FieldValue.serverTimestamp(),
      gid: gid
    };
    this.afs.doc('groups/' + gid).set(GData).then(() => {
     this.auth.getAuthState().subscribe(user => {
      this.currentuser = user;
      const guserdata = {
        gid: gid,
        last: firebase.firestore.FieldValue.serverTimestamp()
      };
      this.afs.doc('users/' + this.currentuser.uid + '/groups/' + gid).set(guserdata).then(() => this.router.navigateByUrl('group/' + gid));
     });
    });
  }

  getGroup(gid) {
    return this.afs.doc<Group>('groups/' + gid).valueChanges();
  }

  getFeed(gid) {
    return this.afs.collection('groups/' + gid + '/feed', ref => ref.orderBy('date')).valueChanges();
  }

  getMembers(gid) {
    return this.afs.collection('groups/' + gid + '/members', ref => ref.orderBy('date')).valueChanges();
  }

}
