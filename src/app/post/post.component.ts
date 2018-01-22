import { PostsService } from './../services/posts.service';
import { DateFormatPipe } from './../services/date.pipe';
import { UserService } from './../services/user.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() inputPost;
  @Input() inputPostID;

  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  body;
  date;
  likes;


  constructor(
    private userService: UserService,
    private dateFormat: DateFormatPipe,
    private postService: PostsService
  ) { }

  ngOnInit() {
    if (this.inputPost) {
      this.body = this.inputPost.body;
      this.date = this.inputPost.date;
      this.likes = this.inputPost.likes;
      this.userService.retrieveUserDocumentFromID(this.inputPost.uid).subscribe(
        user => {
          this.displayName = user.displayName;
          this.userName = user.userName;
          this.photoURL = user.photoURL;
        }
      );
    }
    if (this.inputPostID) {
      this.postService.getPost(this.inputPostID).subscribe(
        post => {
          this.inputPost = post[0];
          this.inputPostID = null;
          this.ngOnInit();
        });
    }
  }

  delete() {
    alert('Delete not implemented yet.');
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

}
