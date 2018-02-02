import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class GroupService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getGroup(gid) {
    return this.afs.doc('groups/' + gid).valueChanges();
  }

}
