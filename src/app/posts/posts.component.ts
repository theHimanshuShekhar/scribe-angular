import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';

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
  emptytext: string;

  closeResult: string;
  modalRef;

  // Modal Data
  username: string;
  author: string;
  authorPhotoURL: string;
  body: string;
  date;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private modalService: NgbModal,
    private location: PlatformLocation
  ) {
    if (this.router.url !== '/home') {
      this.emptytext = 'This user has no posts.';
    }
    if (this.router.url === '/home') {
      this.emptytext = 'There are no posts to show.';
    }
    location.onPopState((event) => {
      // ensure that modal is opened
      if (this.modalRef !== undefined) {
          this.modalRef.close();
      }
    });
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
        return minutes + 'm';
      } else {
        hours = Math.trunc(minutes / 60);
        if (hours < 2) {
          return  hours + 'h';
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
    if (this.modalRef !== undefined) {
      this.modalRef.close();
    }
  }

  getModalData(post) {
    this.author = post.author;
    this.authorPhotoURL = post.authorPhotoURL;
    this.username = post.username;
    this.date = post.date;
    this.body = post.body;
  }

  open(content, post) {
    this.getModalData(post);
    this.modalRef = this.modalService.open(content);
    // push new state to history
    console.log(post.pid);
    history.pushState(null, null, 'post/' + post.pid);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    history.back();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
