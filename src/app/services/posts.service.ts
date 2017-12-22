import { AuthService } from './auth.service';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { UserService } from './user.service';

interface Post {
  title: string;
  body: string;
  author: string;
}

interface NewPost {
  body: string;
  date;
  imgURL?: string;
  likes: number;
  useruid: string;
  pid: string;
}

@Injectable()
export class PostsService {

  // Post Variables
  private posts: Observable<Post[]>;
  private postsCollection: AngularFirestoreCollection<Post>;
  private postDoc: AngularFirestoreDocument<Post>;

  // Author Variables
  private username: string;
  private userCollection: AngularFirestoreCollection<any>;
  private userObs: Observable<any>;
  private user: any;

  // Author data to store with post
  useruid: string;
  photoURL: string;
  status: string;
  displayName: string;
  userName: string;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private userService: UserService) {
  }

  private retrievePosts() {
    this.postsCollection = this.afs.collection('posts', ref => {
      return ref.orderBy('date', 'desc').limit(20);
      });
    this.posts = this.postsCollection.valueChanges();
  }

  public getPosts() {
    this.retrievePosts();
    return this.posts;
  }

  public getAuthorData() {
    // Retrieve user collection
    this.userCollection = this.afs.collection('users', ref => ref.where('uid', '==', this.auth.getUid()));
    this.userObs = this.userCollection.valueChanges();
    this.userObs.forEach(user => {
      if (user) {
        this.user = user;
        this.useruid = this.user[0].uid;
        this.photoURL = this.user[0].photoURL;
        this.displayName = this.user[0].displayName;
        this.status = this.user[0].status;
        this.userName = this.user[0].userName;
      }
    });
  }

  public addPost(newPost) {

    const id = this.afs.createId();
    const postRef = this.afs.collection('posts').doc(id);
    const user = this.auth.getAuthState();

      const data: NewPost = {
        body: newPost.body,
        date: newPost.date,
        imgURL: null,
        likes: 0,
        useruid: this.auth.getUid(),
        'pid': id,
      };

      return postRef.set(data)
        .then(() => {
          console.log('Post Successful - ', id);
        });
    }

    public getUserPosts(useruid) {
      this.postsCollection = this.afs.collection('posts', ref => {
        return ref.where('useruid', '==', useruid).orderBy('date', 'desc');
      });
      this.posts = this.postsCollection.valueChanges();
      return this.posts;
    }

    public getPostDataFromPid(pid) {
      const postDoc = this.afs.doc<any>('posts/' + pid);
      return postDoc.valueChanges();
    }
}
