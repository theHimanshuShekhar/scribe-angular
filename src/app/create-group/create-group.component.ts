import { GroupService } from './../services/group.service';
import { Component, OnInit, Input, group } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  description;
  gname;

  filename;
  inputFile;
  photoURL = '../../assets/images/default-profile.jpg';

  constructor(
    public activeModal: NgbActiveModal,
    private groupService: GroupService
  ) {}

  ngOnInit() {
  }

  createGroup() {
    const groupData = {
      gname: this.gname,
      desc: this.description
    };
    this.groupService.createGroup(groupData);
    this.activeModal.close();
  }

  processImage(event) {
    this.inputFile = event.target.files[0];
    this.filename = this.inputFile.name;
    if (this.filename.length > 25) {
      this.filename = this.filename.slice(0, 25) + '...' + this.filename.slice(this.filename.length - 3);
    }
  }

}
