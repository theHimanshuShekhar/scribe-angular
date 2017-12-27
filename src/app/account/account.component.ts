import { UploadService } from './../services/upload.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Upload } from '../classes/upload';
import * as firebase from 'firebase';

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

  constructor(private auth: AuthService, private router: Router, private afs: AngularFirestore, private uploadService: UploadService) { }

  selectedFiles: FileList;
  currentUpload: Upload;
  progressname;

  ngOnInit() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.userCollection = this.afs.collection('users', ref => ref.where('uid', '==', this.uid));
        this.userCollection.valueChanges().subscribe(userlist => {
          this.displayname = userlist[0].displayName;
          this.username = userlist[0].userName;
          this.status = userlist[0].status;
        });
      } else {
        this.router.navigateByUrl('/home');
      }
    });
  }

  public update() {
    this.auth.updateUser(this.displayname, this.username, this.status);
    if (this.selectedFiles) {
      if (this.selectedFiles[0].size <= 300000) {
        this.uploadSingle();
      } else {
        console.log('invalid file size');
      }
    }
  }

  detectFiles(event) {
    if (event.target.files[0]) {
      this.selectedFiles = event.target.files;
      this.progressname = this.selectedFiles[0].name;
    }
  }

  uploadSingle() {
    if (this.selectedFiles[0].type === 'image/png' || this.selectedFiles[0].type === 'image/jpeg') {
      const file = this.selectedFiles.item(0);
      this.currentUpload = new Upload(file);
      const useruid = this.auth.getUid();
      this.currentUpload.name = 'dp';
      this.uploadService.pushUpload(this.currentUpload, 'user', useruid);
    } else {
      console.log('Invalid format');
    }
  }
}
