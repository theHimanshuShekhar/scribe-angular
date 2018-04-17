import { GroupService } from './../../services/group.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.component.html',
  styleUrls: ['./grouplist.component.css']
})
export class GrouplistComponent implements OnInit {

  @Input() groups;
  @Input() modalRef;

  username;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (!this.groups) {
      this.route.params.subscribe(router => {
        this.username = router.username;
        this.userService.retrieveUserDocumentFromUsername(this.username).subscribe(currentuser => {
          this.userService.getUserGroups(currentuser[0].uid).subscribe(userGroups => {
            if (userGroups) {
              this.groups = [];
              userGroups.forEach((groupData: any) => {
                this.groupService.getGroup(groupData.gid).subscribe(
                  groupDetails => {
                    this.groups.push(groupDetails);
                  });
              });
            }
          });
        });
      });
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
