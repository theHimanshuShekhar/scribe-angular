import { DateFormatPipe } from './../services/date.pipe';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PostsService } from '../services/posts.service';
import {NgbModal, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation, DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

  @Input() inputPost;

  useruid;

  author: string = null;
  authorPhotoURL = '../../assets/images/default-profile.jpg';
  username: string = null;
  body: string = null;
  date;

  // Modal Variables
  closeResult: string;
  modalRef;

  modalAuthor: string = null;
  modalAuthorPhotoURL = '../../assets/images/default-profile.jpg';
  modalUsername: string = null;
  modalBody: string = null;
  modalDate: Date;

  public showPost = true;

  constructor(
    private router: Router,
    private dateFormatPipe: DateFormatPipe,
    private postService: PostsService,
    private userService: UserService,
    private modalService: NgbModal,
    private location: PlatformLocation,
  ) {
      location.onPopState((event) => {
      // ensure that modal is opened
      if (this.modalRef !== undefined) {
          this.modalRef.close();
      }
    });
  }

  ngOnInit() {
    if (!this.inputPost) {
      this.getSinglePost();
    } else {
      this.getUser(this.inputPost);
    }
  }

  getSinglePost() {
    const postObs = this.postService.getPostDataFromPid(this.router.url.slice(6));
    postObs.subscribe(post => {
      if (post) {
        this.getUser(post);
        this.body = post.body;
        this.date = post.date;
        this.useruid = post.useruid;
        console.log(this.useruid);
        this.showPost = true;
      } else {
        this.showPost = false;
      }
    });
  }

  getUser(post) {
    this.useruid = post.useruid;
    this.userService.getUser(this.useruid).subscribe(user => {
      this.authorPhotoURL = user[0].photoURL;
      this.username = user[0].userName;
      this.author = user[0].displayName;
      this.useruid = user[0].useruid;
    });
  }

  public sendToProfile(username) {
    this.router.navigateByUrl('user/' + username);
  }


  public retrieveDate(date, type) {
    setTimeout(500);
    if (date) {
      if (type === 'long') {
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

  // Modal
  getModalData(post) {
    this.modalAuthor = post.author;
    this.modalAuthorPhotoURL = post.authorPhotoURL;
    this.modalUsername = post.username;
    this.modalDate = post.date;
    this.modalBody = post.body;
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
