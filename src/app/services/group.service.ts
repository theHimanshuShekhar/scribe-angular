import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

interface Group {
  gname: string;
  gid: string;
  desc: string;
  createDate;
};

@Injectable()
export class GroupService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getGroup(gid) {
    return this.afs.doc<Group>('groups/' + gid).valueChanges();
  }

}
