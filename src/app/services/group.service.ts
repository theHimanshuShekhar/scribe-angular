import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

interface Group {
  gname: string;
  gid: string;
  desc: string;
  createDate;
}

@Injectable()
export class GroupService {

  constructor(
    private afs: AngularFirestore
  ) { }

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
