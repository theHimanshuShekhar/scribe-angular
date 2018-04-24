import { AngularFirestore } from 'angularfire2/firestore';
import { GroupService } from './../services/group.service';
import { LikesService } from './../services/likes.service';
import { PostsService } from './../services/posts.service';
import { DateFormatPipe } from './../services/date.pipe';
import { UserService } from './../services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() inputPost;
  @Input() inputPostID;
  @Input() parentPid;

  @Input() ParentModalRef;

  modalRef;

  currentuser;
  currentuid;
  showContext = true;

  isLoggedIn = false;
  isSingle = false;
  isCurrentUser = false;
  isInvalid;
  isLoaded = false;
  showLoader = false;
  closeResult: string;
  isLiked;
  likeStyle = 'fa fa-thumbs-o-up';
  likeLen = 0;
  commentLen = 0;

  pid;
  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  body;
  date;
  likes;
  type;
  comments;
  postPhotoURL;

  parentUsername;
  parentUID;

  gname;
  gid;



  constructor(
    private userService: UserService,
    private dateFormat: DateFormatPipe,
    private postService: PostsService,
    private auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private location: PlatformLocation,
    private likeService: LikesService,
    private groupService: GroupService,
    private afs: AngularFirestore
  ) {
    location.onPopState((event) => {
      // ensure that modal is opened
      if (this.modalRef !== undefined) {
          this.modalRef.close();
      }
    });
  }

  ngOnInit() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.currentuid = user.uid;
        this.checkAdmin();
      } else {
        this.isLoggedIn = false;
      }
    });
    this.checkURL();
    // If the post comes from the parent component
    if (this.inputPost) {
      this.isInvalid = false;
      this.body = this.inputPost.body;
      this.date = this.inputPost.date;
      this.pid = this.inputPost.pid;
      this.type = this.inputPost.type;
      this.postPhotoURL = this.inputPost.photoURL;
      if (this.type === 'comment') {
        this.parentPid = this.inputPost.to;
        this.postService.getPost(this.parentPid).subscribe(
          parentPost => {
            if (parentPost) {
              this.parentUID = parentPost.uid;
              this.userService.retrieveUserDocumentFromID(this.parentUID).subscribe(parentUserData => {
                if (parentUserData) {
                  this.parentUsername = parentUserData.userName;
                }
              });
            }
        });
      }
      if (this.type === 'group') {
        if (this.router.url.slice(1, 6) === 'group') {
          this.showContext = false;
        }
        this.gid = this.inputPost.to;
        this.groupService.getGroup(this.gid).subscribe(groupDetails => {
          if (groupDetails) {
            this.gname = groupDetails.gname;
          }
        });
      }
      this.userService.retrieveUserDocumentFromID(this.inputPost.uid).subscribe(
        user => {
          if (user) {
            this.displayName = user.displayName;
            this.userName = user.userName;
            this.photoURL = user.photoURL;
            this.isLoaded = true;
          }
        }
      );
      this.auth.getAuthState().subscribe(
        user => {
          if (user) {
            if (this.inputPost.uid === user.uid) {
              this.currentuser = user.uid;
              this.isCurrentUser = true;
            }
          }
        });
        this.getLikes(this.inputPost.pid);
        this.getComments(this.inputPost.pid);
    }
    // If the postID comes from the parent component
    if (this.inputPostID) {
      this.postService.getPost(this.inputPostID).subscribe(
        post => {
          if (post) {
            this.inputPost = post;
            this.inputPostID = null;
            this.isInvalid = false;
            this.ngOnInit();
          } else {
            this.isInvalid = true;
          }
        });
    }
    // If the post comes from the URL
    if (!this.inputPost && !this.inputPostID && this.router.url !== 'home') {
      this.pid = this.router.url.slice(6);
      this.postService.getPost(this.pid).subscribe(post => {
        if (post) {
          this.inputPostID = this.pid;
          this.isSingle = true;
          this.isInvalid = false;
          this.isLoaded = true;
          this.ngOnInit();
        } else {
          this.isInvalid = true;
        }
      });
    }
  }

  getComments(pid) {
    this.postService.getComments(pid).subscribe(comments => {
      if (comments) {
        this.commentLen = comments.length;
        this.comments = comments;
      }
    });
  }

  getLikes(pid) {
    this.likeService.getLikes(pid).subscribe(likes => {
      this.likes = likes;
      this.likeLen = likes.length;
      this.auth.getAuthState().subscribe(
        user => {
          if (user) {
            this.currentuser = user;
            this.likes.forEach(like => {
              if (like.uid === user.uid) {
                this.isLiked = true;
                this.likeStyle = 'fa fa-thumbs-up post-liked';
              }
            });
          }
        });
    });
  }

  clickLike() {
    if (this.currentuser) {
      if (!this.isLiked) {
        this.likeStyle = 'fa fa-thumbs-up post-liked';
        this.likeService.addLike(this.pid, this.currentuser.uid);
        this.isLiked = true;
      } else {
        this.likeStyle = 'fa fa-thumbs-o-up';
        this.likeService.removeLike(this.pid, this.currentuser.uid);
        this.isLiked = false;
      }
    }
  }

  checkShowError() {
    const url = this.router.url;
    if (url === '/post/' + this.pid) {
      return true;
    } else {
      return false;
    }
  }

  checkURL() {
    const routerURL = this.router.url.slice(1, 5);
    if (routerURL === 'post') {
      this.showLoader = true;
    }
  }

  delete() {
    this.postService.deletePost(this.pid);
  }

  report() {
    this.postService.reportPost(this.pid);
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

  sendTo(type, id?) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    if (this.ParentModalRef) {
      this.ParentModalRef.close();
    }
    if (type === 'landing') {
      this.router.navigateByUrl('start');
    }
    if (type === 'profile') {
      this.router.navigateByUrl('user/' + this.userName);
    }
    if (type === 'group') {
      if (id) {
        this.router.navigateByUrl('group/' + id);
      }
    }
    if (type === 'post') {
      if (id) {
        this.router.navigateByUrl('post/' + this.parentPid);
      } else {
        this.router.navigateByUrl('post/' + this.pid);
      }
    }
  }

  // Modal
  open(content) {
    if (this.ParentModalRef) {
      this.ParentModalRef.close();
    }
    this.modalRef = this.modalService.open(content, {
      size: 'lg',
      windowClass: 'modal-style'
    });
    // push new state to history
    history.pushState(null, null, 'post/' + this.pid);
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

  checkAdmin() {
    this.afs.doc('global/admins/admins/' + this.currentuid).valueChanges().subscribe(admin => {
      if (admin) {
        this.isCurrentUser = true;
      }
    });
  }

}
