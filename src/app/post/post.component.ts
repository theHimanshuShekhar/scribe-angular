import { PostsService } from './../services/posts.service';
import { DateFormatPipe } from './../services/date.pipe';
import { UserService } from './../services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() inputPost;
  @Input() inputPostID;

  isSingle = false;
  isCurrentUser = false;
  isInvalid;
  isLoaded = false;

  pid;
  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  body;
  date;
  likes;


  constructor(
    private userService: UserService,
    private dateFormat: DateFormatPipe,
    private postService: PostsService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    // If the post comes from the parent component
    if (this.inputPost) {
      this.isInvalid = false;
      this.body = this.inputPost.body;
      this.date = this.inputPost.date;
      this.likes = this.inputPost.likes;
      this.pid = this.inputPost.pid;
      this.userService.retrieveUserDocumentFromID(this.inputPost.uid).subscribe(
        user => {
          this.displayName = user.displayName;
          this.userName = user.userName;
          this.photoURL = user.photoURL;
          this.isLoaded = true;
        }
      );
      this.auth.getAuthState().subscribe(
        user => {
          if (this.inputPost.uid === user.uid) {
            this.isCurrentUser = true;
          }
        });
    }
    // If the postID comes from the parent component
    if (this.inputPostID) {
      this.postService.getPost(this.inputPostID).subscribe(
        post => {
          if (post) {
            this.inputPost = post;
            this.inputPostID = null;
            this.isInvalid = false;
            this.ngOnInit();
          } else {
            console.log('invalid');
            this.isInvalid = true;
          }
        });
    }
    // If the post comes from the URL
    if (!this.inputPost && !this.inputPostID && this.router.url !== 'home') {
      this.pid = this.router.url.slice(6);
      this.isInvalid = true;
      this.postService.getPost(this.pid).subscribe(post => {
        if (post) {
          this.inputPostID = this.pid;
          this.isSingle = true;
          this.isInvalid = false;
          this.isLoaded = true;
          this.ngOnInit();
        } else {
          this.isInvalid = true;
        }
      });
    }
  }

  delete() {
    this.postService.deletePost(this.pid);
  }

  retrieveDate(date, type?) {
    if (date) {
      if (type === 'long') {
        return this.dateFormat.transform(date, type);
      } else {
        const prevDate = date;
        const newDate = new Date();
        const ms = newDate.getTime() - prevDate.getTime();
        const min = Math.trunc(ms / 60000);
        let hours;
        if (min < 59) {
          if (min < 1) {
            return 'just now';
          }
          return min + 'm';
        } else {
          hours = Math.trunc(min / 60);
          if (hours >= 1 && hours < 24) {
            return hours + 'h';
          } else {
            return this.dateFormat.transform(prevDate);
          }
        }
      }
    }
  }

  sendTo(type) {
    if (type === 'profile') {
      this.router.navigateByUrl('user/' + this.userName);
    }
    if (type === 'post') {
      this.router.navigateByUrl('post/' + this.pid);
    }
  }

}
