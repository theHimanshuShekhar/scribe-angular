import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.component.html',
  styleUrls: ['./grouplist.component.css']
})
export class GrouplistComponent implements OnInit {

  @Input() groups;
  @Input() modalRef;

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.modalRef.close();
  }

}
