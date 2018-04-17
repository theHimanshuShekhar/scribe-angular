import { FollowService } from './../../services/follow.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() uid: string;
  @Input() type: string;
  @Input() modalRef;

  username;
  displayname;
  photoURL;
  status;

  isCurrentUser = false;

  btnFollow = 'Follow';

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private followService: FollowService
  ) { }

  ngOnInit() {
    this.userService.retrieveUserDocumentFromID(this.uid).subscribe(
      user => {
        if (user) {
          this.username = user.userName;
          this.displayname = user.displayName;
          this.status = user.status;
          this.photoURL = user.photoURL;
          this.checkFollowing();
        }
    });
  }

  checkFollowing() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        if (user.uid === this.uid) {
          this.isCurrentUser = true;
        } else {
          this.followService.isFollowing(this.uid, user.uid).subscribe(followinguser => {
            if (followinguser.length > 0) {
              this.btnFollow = 'Following';
            } else {
              this.btnFollow = 'Follow';
            }
          });
        }
      }
    });
  }

  follow() {
    if (this.btnFollow === 'Following') {
      this.followService.unfollow(this.uid);
    } else {
      this.followService.follow(this.uid);
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
