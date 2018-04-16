import { AuthService } from './../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group.service';
import { DateFormatPipe } from '../services/date.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  isInvalid;
  isSubbed = false;
  isLoggedin;
  isLoaded = false;

  posts;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private datePipe: DateFormatPipe,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      group => {
        this.gid = group.gid;
        this.groupService.getGroup(this.gid).subscribe(
          groupDoc => {
            if (groupDoc) {
              this.gname = groupDoc.gname;
              this.desc = groupDoc.desc;
              this.createDate = groupDoc.createDate;
              this.isLoaded = true;
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

  checkLogin() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        this.isLoggedin = true;
      } else {
        this.isLoggedin = false;
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
    this.modalService.open(content);
  }
}
