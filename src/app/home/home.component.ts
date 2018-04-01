import { GroupService } from './../services/group.service';
import { PostsService } from './../services/posts.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from 'angularfire2/firestore';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { CreateGroupComponent } from '../create-group/create-group.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  bannerURL;
  userid;
  totalFollowers;
  totalFollowing;
  totalScribes;

  feedPosts;

  groups = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private postsService: PostsService,
    private afs: AngularFirestore,
    private titleService: Title,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private groupService: GroupService
  ) { }

  getStyle() {
    if (this.bannerURL) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.bannerURL})`);
    }
  }

  ngOnInit() {
    this.auth.checkLogin();
    this.titleService.setTitle('Home');
    this.getCurrentUser();
  }
  sendTo(path, location?) {
    if (path === 'profile') {
      this.router.navigateByUrl('user/' + this.userName);
    }
    if (path === 'account') {
      this.router.navigateByUrl('account');
    }
    if (path === 'group' && location) {
      this.router.navigateByUrl('group/' + location);
    }
    if (path === 'custom' && location) {
      this.router.navigateByUrl(location);
    }
  }
  getCurrentUser() {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          this.userService.retrieveUserDocument(user.uid).subscribe(
            userDoc => {
              if (userDoc) {
                this.displayName = userDoc.displayName;
                this.userName = userDoc.userName;
                this.photoURL = userDoc.photoURL;
                this.userid = userDoc.uid;
                this.totalScribes = userDoc.totalScribes ? userDoc.totalScribes : 0;
                this.totalFollowers = userDoc.totalFollowers ? userDoc.totalFollowers : 0;
                this.totalFollowing = userDoc.totalFollowing ? userDoc.totalFollowing : 0;

                // Get pids from user feed
                this.postsService.getFeed(this.userid).subscribe(
                  feedPosts => this.feedPosts = feedPosts
                );

                // Get user's groups
                this.userService.getUserGroups(this.userid).subscribe(
                  userGroups => {
                    if (userGroups) {
                      this.groups = [];
                      userGroups.forEach((groupData: any) => {
                        this.groupService.getGroup(groupData.gid).subscribe(
                          groupDetails => {
                            this.groups.push(groupDetails);
                          });
                      });
                    }
                  }
                );
              }
            });
        } else {
          this.router.navigateByUrl('start');
        }
    });
  }

  createGroup() {
    const modalRef = this.modalService.open(CreateGroupComponent, {
      size: 'lg',
      windowClass: 'modal-style'
    });
  }
}
