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

  getCommonRoom(uid) {
    this.getProfileUserRooms(uid).subscribe(ProfileUsersChatrooms => {
      if (ProfileUsersChatrooms) {
        ProfileUsersChatrooms.forEach(room:any => {
          this.getChatroom(room.rid).subscribe(
            chatroom => {
              if (chatroom) {
                
              }
            });
        });
      }
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
          user1: curruser.uid,
          user2: profileuid
        };
        this.afs.doc('messaging/' + rid).set(roomData);
      });
  }
  

}
