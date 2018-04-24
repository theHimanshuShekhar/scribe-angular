import { DomSanitizer, Title } from '@angular/platform-browser';
import { UploadService } from './../services/upload.service';
import { CreateGroupComponent } from './../create-group/create-group.component';
import { AuthService } from './../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group.service';
import { DateFormatPipe } from '../services/date.pipe';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  gid;
  gname;
  desc;
  totalMembers;
  totalPosts;
  createDate;
  members;
  admin;
  bannerURL;

  isInvalid;
  isSubbed = false;
  isLoggedin;
  isLoaded = false;
  isAdmin = false;

  posts;
  modalRef;
  closeResult;

  filename;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private datePipe: DateFormatPipe,
    private modalService: NgbModal,
    private location: PlatformLocation,
    private uploadService: UploadService,
    private sanitizer: DomSanitizer,
    private titleService: Title
  ) {
    location.onPopState((event) => {
      // ensure that modal is opened
      if (this.modalRef !== undefined) {
          this.modalRef.close();
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(
      routeurl => {
        this.gid = routeurl.gid;
        this.groupService.getGroup(this.gid).subscribe(
          groupDoc => {
            if (groupDoc) {
              this.gname = groupDoc.gname;
              this.desc = groupDoc.desc;
              this.createDate = groupDoc.createDate;
              this.admin = groupDoc.admin ? groupDoc.admin : null;
              this.isLoaded = true;
              this.bannerURL = groupDoc.bannerURL ? groupDoc.bannerURL : null;
              this.titleService.setTitle(this.gname + ' | ' + this.desc);
              this.checkAdmin();
            } else {
              console.log('invalid');
              this.isInvalid = true;
              this.isLoaded = true;
            }
          });
      this.groupService.getFeed(this.gid).subscribe(
        feed => {
          this.posts = feed;
        });
      this.groupService.getMembers(this.gid).subscribe(
        memberList => {
          this.members = memberList;
        });
        this.checkSub();
        this.checkLogin();
    });
  }

  getStyle() {
    if (this.bannerURL) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.bannerURL})`);
    }
  }

  checkLogin() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        this.isLoggedin = true;
      } else {
        this.isLoggedin = false;
      }
    });
  }

  checkAdmin() {
    this.auth.getAuthState().subscribe(curruser => {
      if (curruser) {
        if (this.admin === curruser.uid) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    });
  }

  checkSub() {
    this.auth.getAuthState().subscribe(currentuser => {
      if (currentuser) {
        this.afs.doc('groups/' + this.gid + '/members/' + currentuser.uid)
        .valueChanges()
        .subscribe(user => {
          if (user) {
            this.isSubbed = true;
          } else {
            this.isSubbed = false;
          }
        });
      }
    });
  }

  subscribe() {
    this.groupService.subscribe(this.gid);
  }

  unsubscribe() {
    this.groupService.unsubscribe(this.gid);
    this.checkSub();
  }

  getDate() {
    return this.datePipe.transform(this.createDate, 'month');
  }

  open(content) {
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  processImage(event) {
    const file = event.target.files[0];
    if (file.size > 2000000) {
      this.filename = 'Max Filesize 2Mb!';
    } else {
      this.filename = 'Edit Banner';
      this.uploadService.pushUpload(file, 'group', this.gid);
    }
  }
}
