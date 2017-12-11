import { DateFormatPipe } from './../services/date.pipe';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core/src/metadata/directives';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

  author: string = null;
  authorPhotoURL = '../../assets/images/default-profile.jpg';
  username: string = null;
  body: string = null;
  date;

  public invalidPost = false;

  constructor(
    private router: Router,
    private dateFormatPipe: DateFormatPipe,
    private postService: PostsService
  ) { }

  ngOnInit() {
    const postObs = this.postService.getPostDataFromPid(this.router.url.slice(6));
    postObs.subscribe(post => {
      if (post) {
        this.author = post.author;
        this.body = post.body;
        this.authorPhotoURL = post.authorPhotoURL;
        this.date = post.date;
        this.username = post.username;
      } else {
        console.log('invalid');
        this.invalidPost = true;
      }
    });
  }


  public sendToProfile(username) {
    this.router.navigateByUrl('user/' + username);
  }

  public getDate(date) {
    if (date) {
        return this.dateFormatPipe.transform(date, 'long');
      }
    }
}
