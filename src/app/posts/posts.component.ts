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
    private location: PlatformLocation,
    private dateFormatPipe: DateFormatPipe,
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

  public getDate(date, type?) {
    setTimeout(500);
    if (date) {
      if (type) {
        return this.dateFormatPipe.transform(date, type);
      }
      const prevDate = date;
      const newDate = new Date();
      const milliseconds: number = newDate.getTime() - prevDate.getTime();
      const minutes = Math.trunc(milliseconds / 60000);
      let hours;
      if (minutes < 59) {
        if (minutes < 1) {
          return 'just now';
        }
        return minutes + 'm';
      } else {
        hours = Math.trunc(minutes / 60);
        if (hours >= 1 && hours < 24) {
          return hours + 'h';
        } else {
          return this.dateFormatPipe.transform(prevDate);
        }
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
      if (post.length === 0) {
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
