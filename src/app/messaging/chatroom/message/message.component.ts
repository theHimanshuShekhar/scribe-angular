import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() messageData;

  style;
  curruser;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(curruser => {
      if (curruser) {
        if (this.messageData.uid === curruser.uid) {
          this.curruser = true;
          this.style = 'text-right bg-white rounded mt-1 mb-2 py-2 px-3 border-primary';
        } else {
          this.style = 'text-left bg-white rounded mt-1 mb-2 py-2 px-3';
        }
      }
    });
  }

  delete() {
    this.afs.doc('messaging/' + this.messageData.rid + '/messages/' + this.messageData.mid).delete();
  }

}
