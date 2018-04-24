import { Injectable, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import { Router } from '@angular/router';
import { LikesService } from './likes.service';

interface QueryConfig {
  path: string;
  field?: string;
  value?: string;
  limit: number;
  reverse: boolean;
  prepend: boolean;
}

@Injectable()
export class PostsService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
  ) { }

  // Get a user's posts
  getProfilePosts(uid) {
    return this.afs.collection('posts', ref => ref.where('uid', '==', uid).orderBy('date', 'desc')).valueChanges();
  }

  // Add post //
  addPost(newPost) {
    this.auth.getAuthState().subscribe(
      currentuser => {
        const date = firebase.firestore.FieldValue.serverTimestamp();
        const post = {
          pid: newPost.pid,
          uid: currentuser.uid,
          date: date,
          body: newPost.body,
          photoURL: newPost.photoURL ? newPost.photoURL : null,
          to: newPost.to ? newPost.to : null,
          type: newPost.type ? newPost.type : 'user'
        };
        const postRef = this.afs.collection('posts').doc(newPost.pid);
        return postRef.set(post)
          .then(() => {
            console.log('Post Successful -', newPost.pid);
          });
      });
  }

  // Add Comment //
  addComment(newPost) {
    this.auth.getAuthState().subscribe(
      currentuser => {
        const date = firebase.firestore.FieldValue.serverTimestamp();
        const post = {
          pid: newPost.pid,
          uid: currentuser.uid,
          date: date,
          body: newPost.body,
          photoURL: newPost.photoURL ? newPost.photoURL : null,
          to: newPost.to ? newPost.to : null,
          type: newPost.type ? newPost.type : 'user'
        };
        const postRef = this.afs.collection('posts').doc(newPost.pid);
        return postRef.set(post)
          .then(() => {
            const comment = {
              pid: newPost.pid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            this.afs.doc('posts/' + newPost.to + '/comments/' + newPost.pid).set(comment);
            console.log('Comment Successful -', newPost.pid);
          });
      });
  }

  // Get a post's comments
  getComments(pid) {
    return this.afs.collection('posts/' + pid + '/comments', ref => ref.orderBy('timestamp', 'asc')).valueChanges();
  }

  // Get user's feed
  getFeed(uid) {
    return this.afs.collection<any>('users/' + uid + '/feed',
      ref => ref.orderBy('date', 'desc')
      .limit(200))
      .valueChanges();
  }

  // Get individual post
  public getPost(pid) {
    return this.afs.doc<any>('posts/' + pid).valueChanges();
  }

  // Delete post
  public deletePost (pid) {
    this.afs.doc<any>('posts/' + pid).delete();
  }

  // Report post
  public reportPost (pid) {
    this.auth.getAuthState().subscribe(curruser => {
      if (curruser) {
        const repid = this.afs.createId();
        const report = {
          repid: repid,
          pid: pid,
          uid: curruser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        this.afs.doc('reports/' + repid).set(report).then(() => console.log('Report submitted for post ' + pid));
      }
    });
  }

  getMostLikedPosts() {
    return this.afs.collection('posts', ref => ref.orderBy('totalLikes', 'desc').limit(3)).valueChanges();
  }

  getMostCommentedPosts() {
    return this.afs.collection('posts', ref => ref.orderBy('totalComments', 'desc').limit(3)).valueChanges();
  }

  updatePhotoURL(url, pid) {
    const data = {
      photoURL: url
    };
    this.afs.doc('posts/' + pid).update(data);
  }

  updateBannerURL(url, uid) {
    const data = {
      bannerURL: url
    };
    this.afs.doc('users/' + uid).update(data);
  }
}

