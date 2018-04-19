import { GroupService } from './../services/group.service';
import { PostsService } from './../services/posts.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  mostCommented;
  mostLiked;
  mostFollowed;
  mostSubbed;

  constructor(
    private title: Title,
    private postService: PostsService,
    private userService: UserService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.title.setTitle('Scribe | About');
    this.postService.getMostLikedPosts().subscribe(posts => this.mostLiked = posts);
    this.postService.getMostCommentedPosts().subscribe(posts => this.mostCommented = posts);
    this.userService.getSuggestedUsers().subscribe(users => this.mostFollowed = users);
    this.groupService.getMostSubbed().subscribe(groups => this.mostSubbed = groups);
  }
}
