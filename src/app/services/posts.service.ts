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

  // New Post update
  private _updatedPost = new BehaviorSubject<any>(null);
  updatedPost = this._updatedPost.asObservable();

  private query: QueryConfig;;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
  ) { }

  getProfilePosts(uid) {
    return this.afs.collection('posts', ref => ref.where('uid', '==', uid)).valueChanges();
  }

  // Add post //
  addPost(newPost) {
    this.auth.getAuthState().subscribe(
      currentuser => {
        const pid = this.afs.createId();
        const date = firebase.firestore.FieldValue.serverTimestamp();
        const post = {
          pid: pid,
          uid: currentuser.uid,
          date: date,
          body: newPost.body,
          photoURL: newPost.photoURL ? newPost.photoURL : null,
          to: newPost.to ? newPost.to : null,
          type: newPost.type ? newPost.type : 'user'
        };
        const postRef = this.afs.collection('posts').doc(pid);
        return postRef.set(post)
          .then(() => {
            console.log('Post Successful -', pid);
          });
      });
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
}

