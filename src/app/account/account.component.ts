import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountComponent implements OnInit {
  username: string;
  status: string;
  displayname: string;

  uid;
  userCollection: AngularFirestoreCollection<any>;
  userObs: Observable<any>;

  constructor(private auth: AuthService, private router: Router, private afs: AngularFirestore) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.userCollection = this.afs.collection('users', ref => ref.where('uid', '==', this.uid));
        this.userCollection.valueChanges().subscribe(user => {
          this.displayname = user[0].displayName;
          this.username = user[0].userName;
          this.status = user[0].status;
        });
      } else {
        this.router.navigateByUrl('/home');
      }
    });
  }

  public update() {
    this.auth.updateUser(this.displayname, this.username, this.status);
    this.router.navigateByUrl('/home');
  }
}
