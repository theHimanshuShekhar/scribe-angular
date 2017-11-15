import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {

  public posts;
  constructor(postsService: PostsService) {
    this.posts = postsService.getPosts();
  }

  ngOnInit() {
  }


}
