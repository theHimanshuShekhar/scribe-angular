import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {

  @Input('useruid') private useruid: string;
  public posts: Observable<any>;

  showNoPosts:boolean = false;

  constructor(private postsService: PostsService, private router: Router) {
  }

  public getDate(date) {
    setTimeout(500);
    if (date) {
      const prevDate = date;
      const newDate = new Date();
      const milliseconds: number = newDate.getTime() - prevDate.getTime();
      const minutes = Math.trunc(milliseconds / 60000);
      let hours;
      let days;
      let months;
      let years;
      if (minutes < 59) {
        if (minutes < 1) {
          return 'just now';
        }
        return minutes + ' minutes ago';
      } else {
        hours = Math.trunc(minutes / 60);
        if (hours < 2) {
          return  hours + ' hour ago';
        }
        if (hours > 24 ) {
          days = Math.trunc(hours / 24);
          return days + ' days ago';
        }
        if (hours > 730) {
          months = Math.trunc(hours / 730);
          if (months > 12) {
            years = Math.trunc(months / 12);
            if (years < 2) {
              return years + ' year ago';
            } else {
              return years + ' years ago';
            }
          }
          if (months < 2) {
            return months + ' month ago';
          }
          return months + ' months ago';
        }
        return  hours + ' hours ago';
      }
    }
  }

  ngOnInit() {
    if (!this.useruid) {
      this.posts = this.postsService.getPosts();
    } else {
      this.posts = this.postsService.getUserPosts(this.useruid);
    }
    this.posts.forEach(post => {
      if (post.length == 0) {
        this.showNoPosts = true;
      } else {
        this.showNoPosts = false;
      }
    });
  }

  public sendToProfile(username) {
    this.router.navigateByUrl('user/' + username);
  }


}
