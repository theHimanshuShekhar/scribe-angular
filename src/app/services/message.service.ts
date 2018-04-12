import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';

@Injectable()
export class MessageService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  getProfileUserRooms(uid) {
    return this.afs.collection('/users/' + uid + '/messaging').valueChanges();
  }

  checkChatroom(profileuid) {
    this.auth.getAuthState().subscribe(curruser => {
      const currentuid = curruser.uid;
      this.afs.collection('users/' + curruser.uid + '/messaging', ref => ref.where('uid', '==', profileuid)).valueChanges()
      .subscribe(chatroom => {
        if (chatroom.length === 1) {
          console.log('open chatroom modal');
        } else {
          this.createChatroom(profileuid);
        }
      });
    });
  }

  getChatroom(rid) {
    return this.afs.doc('messaging/' + rid).valueChanges();
  }

  createChatroom(profileuid) {
    this.auth.getAuthState().subscribe(
      curruser => {
        const rid = this.afs.createId();
        const roomData = {
          rid: rid,
        };
        this.afs.doc('messaging/' + rid).set(roomData)
        .then(() => {
          let data = {
            uid: profileuid
          };
          this.afs.doc('messaging/' + rid + '/users/' + profileuid).set(data);
          data = {
            uid: curruser.uid
          }
          this.afs.doc('messaging/' + rid + '/users/' + curruser.uid).set(data);
        });
      });
  }
}
