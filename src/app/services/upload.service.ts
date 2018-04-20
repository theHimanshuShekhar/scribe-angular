import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';

@Injectable()
export class UploadService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private storage: AngularFireStorage
  ) { }

  uploadTask;

  // Execute file upload to firebase storage
  pushUpload(file, type?: string, uid?: string) {
    if (type === 'user') {
      const downloadURL = this.storage.upload('user-uploads/' + uid + '/dp', file).downloadURL();
      downloadURL.subscribe(url => {
        if (url) {
          this.auth.updatePhotoURL(url);
        }
      });
    } else if (type === 'post') {
      console.log('post-image');
    }
  }
}
