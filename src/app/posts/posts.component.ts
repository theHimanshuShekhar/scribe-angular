import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {

  public posts: Observable<any>;
  constructor(postsService: PostsService) {
    this.posts = postsService.getPosts();
  }

  public getDate(date) {
    setTimeout(100);
    const prevDate = date;
    const newDate = new Date();
    const milliseconds: number = newDate.getTime() - prevDate.getTime();
    return Math.trunc(milliseconds / 60000);
  }

  ngOnInit() {
  }


}
