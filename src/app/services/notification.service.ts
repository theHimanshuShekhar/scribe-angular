import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  getUserUnread(uid) {
    return this.afs.collection('users/' + uid + '/unread', ref => ref.orderBy('timestamp', 'desc')).valueChanges();
  }

  clearUnread(uid) {
    this.afs.collection('users/' + uid + '/unread').valueChanges().subscribe(unread => {
      unread.forEach(notif => {
        const notification: any = notif;
        this.afs.doc('users/' + uid + '/unread/' + notification.pid).delete();
      });
    });
  }
}
