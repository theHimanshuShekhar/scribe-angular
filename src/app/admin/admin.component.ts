import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminDetails;
  feedbacks;
  reports;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Admin Dashboard');
    this.auth.getAuthState().subscribe(curruser => {
      if (curruser) {
        this.afs.doc('global/admins/admins/' + curruser.uid).valueChanges().subscribe(admin => {
          if (!admin) {
            this.router.navigateByUrl('/home');
          } else {
            this.adminDetails = admin;
            this.getData();
          }
        });
      } else {
        this.router.navigateByUrl('/home');
      }
    });
  }

  getData() {
    this.afs.collection('feedback/', ref => ref.orderBy('timestamp')).valueChanges().subscribe(feedbacks => this.feedbacks = feedbacks);
    this.afs.collection('reports/', ref => ref.orderBy('timestamp')).valueChanges().subscribe(reports => this.reports = reports);
  }

}
