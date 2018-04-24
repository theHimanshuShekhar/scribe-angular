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
  admin?: string;
  bannerURL?: string;
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
      gid: gid,
    };
    this.afs.doc('groups/' + gid).set(GData).then(() => {
     this.auth.getAuthState().subscribe(user => {
      this.currentuser = user;
      const adminData = {admin: this.currentuser.uid};
      this.afs.doc('groups/' + GData.gid).update(adminData);
      const guserdata = {
        gid: gid,
        last: firebase.firestore.FieldValue.serverTimestamp()
      };
      this.afs.doc('users/' + this.currentuser.uid + '/groups/' + gid).set(guserdata).then(() => this.router.navigateByUrl('group/' + gid));
      const ugroupdata = {
        uid: this.currentuser.uid,
        date: firebase.firestore.FieldValue.serverTimestamp()
      };
      this.afs.doc('groups/' + gid + '/members/' + this.currentuser.uid).set(ugroupdata);
     });
    });
  }

  editGroup(data) {
    const GData = {
      gname: data.gname,
      desc: data.desc,
    };
    return this.afs.doc('groups/' + data.gid).update(GData);
  }

  subscribe(gid) {
    this.auth.getAuthState().subscribe(currentuser => {
      if (currentuser) {
        const uid = currentuser.uid;
        const data = {
          uid: uid,
          date: firebase.firestore.FieldValue.serverTimestamp()
        };
        this.afs.doc('groups/' + gid + '/members/' + uid).set(data);
      }
    });
  }
  unsubscribe(gid) {
    this.auth.getAuthState().subscribe(currentuser => {
      if (currentuser) {
        const uid = currentuser.uid;
        this.afs.doc('groups/' + gid + '/members/' + uid).delete();
      }
    });
  }

  getGroup(gid) {
    return this.afs.doc<Group>('groups/' + gid).valueChanges();
  }

  getFeed(gid) {
    return this.afs.collection('groups/' + gid + '/feed', ref => ref.orderBy('date', 'desc')).valueChanges();
  }

  getMembers(gid) {
    return this.afs.collection('groups/' + gid + '/members', ref => ref.orderBy('date')).valueChanges();
  }

  getMostSubbed() {
    return this.afs.collection('groups', ref => ref.orderBy('totalMembers', 'desc')).valueChanges();
  }

  updateBannerURL(url, gid) {
    const data = {
      bannerURL: url
    };
    this.afs.doc('groups/' + gid).update(data)
    .then(() => console.log('Group banner updated'));
  }

}
