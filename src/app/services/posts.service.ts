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

  // Post querying with pagination //

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) { }

  init(path: string, field: string, value: string) {
    this._data = new BehaviorSubject([]);
    this._done = new BehaviorSubject(false);
    this._loading = new BehaviorSubject(false);
      this.query = {
        path,
        limit: 10,
        field,
        value,
        reverse: false,
        prepend: false,
      };
      const first = this.afs.collection(this.query.path,
        ref => ref
          .where(this.query.field, '==', this.query.value)
          .orderBy('date', 'desc')
          .limit(this.query.limit)
      );

    this.mapAndUpdate(first);

    this.data = this._data.asObservable().scan(
      (acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      });
  }

  more() {
    let more;
    const cursor = this.getCursor();

    more = this.afs.collection(this.query.path,
      ref => ref
        .where(this.query.field, '==', this.query.value)
        .orderBy('date', 'desc')
        .startAfter(cursor)
        .limit(this.query.limit)
      );

    this.mapAndUpdate(more);
  }

  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }

 // Maps the snapshot to usable format the updates source
 private mapAndUpdate(col: AngularFirestoreCollection<any>) {
  if (this._done.value || this._loading.value) { return; }
  // loading
  this._loading.next(true);
  // Map snapshot with doc ref (needed for cursor)
  return col.snapshotChanges()
    .do(arr => {
      let values = arr.map(snap => {
        const data = snap.payload.doc.data();
        const doc = snap.payload.doc;
        return { ...data, doc };
      });

      // If prepending, reverse the batch order
      values = this.query.prepend ? values.reverse() : values;
      // update source with new values, done loading
      this._data.next(values);
      this._loading.next(false);
      // no more values, mark done
      if (!values.length) {
        this._done.next(true);
      }
    })
    .take(1)
    .subscribe();
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
            if (this.router.url !== '/home') {
              this.init('posts', 'uid', currentuser.uid);
            }
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

