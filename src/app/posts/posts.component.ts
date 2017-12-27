import { DateFormatPipe } from './../services/date.pipe';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation, DatePipe } from '@angular/common';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {

  @Input('useruid') private useruid: string;
  public posts: Observable<any>;



  showNoPosts = false;

  // Modal Data
  username: string;
  author: string;
  authorPhotoURL: string;
  body: string;
  date;

  constructor(
    private postsService: PostsService,
    private router: Router,
  ) {  }


  ngOnInit() {
    this.posts = null;
    if (!this.useruid) {
      this.posts = this.postsService.getPosts();
    } else {
      this.posts = this.postsService.getUserPosts(this.useruid);
    }
    this.posts.forEach(post => {
      if (post.length === 0) {
        this.showNoPosts = true;
      } else {
        this.showNoPosts = false;
      }
    });
  }

}
