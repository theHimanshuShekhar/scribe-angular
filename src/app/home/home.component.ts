import { PostsService } from './../services/posts.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  bannerURL;
  userid;
  totalFollowers;
  totalFollowing;
  totalScribes;

  feedPosts;

  groupList[];

  constructor(
    private auth: AuthService,
    private router: Router,
    private postsService: PostsService,
    private afs: AngularFirestore,
    private titleService: Title,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  getStyle() {
    if (this.bannerURL) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.bannerURL})`);
    }
  }

  ngOnInit() {
    this.auth.checkLogin();
    this.titleService.setTitle('Home');
    this.getCurrentUser();
  }
  sendTo(path) {
    if (path === 'profile') {
      this.router.navigateByUrl('user/' + this.userName);
    }
    if (path === 'account') {
      this.router.navigateByUrl('account');
    }
  }
  getCurrentUser() {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          this.userService.retrieveUserDocument(user.uid).subscribe(
            userDoc => {
              if (userDoc) {
                this.displayName = userDoc.displayName;
                this.userName = userDoc.userName;
                this.photoURL = userDoc.photoURL;
                this.userid = userDoc.uid;
                this.totalScribes = userDoc.totalScribes ? userDoc.totalScribes : 0;
                this.totalFollowers = userDoc.totalFollowers ? userDoc.totalFollowers : 0;
                this.totalFollowing = userDoc.totalFollowing ? userDoc.totalFollowing : 0;

                // Get pids from user feed
                this.postsService.getFeed(this.userid).subscribe(
                  feedPosts => {
                    this.feedPosts = feedPosts;
                  });

                // Get user's groups
                
              }
            });
        } else {
          this.router.navigateByUrl('start');
        }
    });
  }
}
