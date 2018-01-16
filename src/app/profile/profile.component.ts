import { PostsService } from './../services/posts.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  status;
  joinDate = 'May 2009';
  userid = null;
  bannerURL;

  totalScribes;
  totalFollowers = 12;
  totalFollowing = 15;
  totalLikes = 23;

  posts: any;

  showInvalid: boolean;
  isLoaded: boolean;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private postsService: PostsService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.isLoggedIn = false;
    this.isLoaded = false;
    this.titleService.setTitle('Profile');
    this.userService.retrieveUserDocumentFromUsername(this.router.url.slice(6)).subscribe(
      user => {
        if (user[0]) {
          const uservar: any = user[0];
          this.displayName = uservar.displayName;
          this.userName = uservar.userName;
          this.status = uservar.status;
          this.photoURL = uservar.photoURL;
          this.userid = uservar.uid;
          this.isLoaded = true;
          this.titleService.setTitle(this.displayName + ' @' + this.userName);
          this.checkCurrentUser();
          this.postsService.getUserPosts(this.userid).subscribe(
            posts => {
              this.posts = posts;
              this.totalScribes = posts.length;
            });
        } else {
          this.isLoaded = true;
          this.showInvalid = true;
        }
    });
  }

  checkCurrentUser() {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          if (this.userid) {
            if (this.userid === user.uid) {
              this.isLoggedIn = true;
            }
          }
        }
    });
  }

  getStyle() {
    if (this.bannerURL) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.bannerURL})`);
    }
  }
}
