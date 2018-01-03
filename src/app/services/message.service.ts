import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';

@Injectable()
export class MessageService {

  collection: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  getMessageList(userid) {
    this.collection = this.afs.collection('users/' + userid + '/msgs');
    return this.collection.valueChanges();
  }

  getMessages(mid) {
    this.collection = this.afs.collection('messages/' + mid + '/messages');
    return this.collection.valueChanges();
  }

  getRoom(mid) {
    return this.afs.doc<any>('messages/' + mid).valueChanges();
  }
}
