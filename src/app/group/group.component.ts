import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group.service';
import { DateFormatPipe } from '../services/date.pipe';

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

  posts;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private datePipe: DateFormatPipe
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
            } else {
              console.log('invalid');
              this.isInvalid = true;
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
    });
  }

  getDate() {
    return this.datePipe.transform(this.createDate, 'month');
  }
}
