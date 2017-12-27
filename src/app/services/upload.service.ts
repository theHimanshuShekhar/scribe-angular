import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Upload } from '../classes/upload';
import { AuthService } from './auth.service';

@Injectable()
export class UploadService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  private basePath = '/uploads/';
  private uploadTask: firebase.storage.UploadTask;

  // Execute file upload to firebase storage
  pushUpload(upload: Upload, type?: string, uid?: string) {
    const storageRef = firebase.storage().ref();
    if (type === 'user') {
      this.uploadTask = storageRef.child(`${'user-uploads'}/${uid}/${upload.name}`).put(upload.file);
    } else if (type === 'post') {
      console.log('post-image');
    } else {
      this.uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
    }

    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) => {
      // upload in progress
      upload.progress = (this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes) * 100;
    },
  (error) => {
    // upload failed
    console.log(error);
  },
  () => {
    // upload success
    upload.url = this.uploadTask.snapshot.downloadURL;
    upload.name = upload.file.name;

    // upload to firestore
    this.auth.updatePhotoURL(upload.url);
  });
  }
}
