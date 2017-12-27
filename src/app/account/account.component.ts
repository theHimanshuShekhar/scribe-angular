import { UploadService } from './../services/upload.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Upload } from '../classes/upload';
import * as firebase from 'firebase';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';

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
  photoURL= '../../assets/images/default-profile.jpg';

  uid;
  userCollection: AngularFirestoreCollection<any>;
  userObs: Observable<any>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    private uploadService: UploadService,
    private ng2ImgMax: Ng2ImgMaxService,
  ) { }

  selectedFiles: FileList;
  currentUpload: Upload;
  progressname;
  uploadedImage;

  ngOnInit() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.userCollection = this.afs.collection('users', ref => ref.where('uid', '==', this.uid));
        this.userCollection.valueChanges().subscribe(userlist => {
          this.displayname = userlist[0].displayName;
          this.username = userlist[0].userName;
          this.status = userlist[0].status;
          this.photoURL = userlist[0].photoURL;
        });
      } else {
        this.router.navigateByUrl('/home');
      }
    });
  }

  public update() {
    this.auth.updateUser(this.displayname, this.username, this.status);
  }

  detectFiles(event) {
    if (event.target.files[0]) {
      this.progressname = event.target.files[0].name;
      const image = event.target.files[0];
      this.resizeImage(image);
    }
  }

  resizeImage(image) {
    this.ng2ImgMax.resizeImage(image, 150, 150).subscribe(
      result => {
        console.log('resized');
        this.compressImage(result);
      },
      error => {
        console.log('Failed to resize image');
      }
    );
  }

  compressImage(image) {
    this.ng2ImgMax.compressImage(image, 0.0075).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        this.uploadSingle();
      },
      error => {
        console.log('Failed to compress image');
      }
    );
  }

  uploadSingle() {
    this.currentUpload = new Upload(this.uploadedImage);
    const useruid = this.auth.getUid();
    this.currentUpload.name = 'dp';
    this.uploadService.pushUpload(this.currentUpload, 'user', useruid);
  }
}
