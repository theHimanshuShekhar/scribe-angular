import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() messageData;

  style;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(curruser => {
      if (this.messageData.uid === curruser.uid) {
        this.style = 'text-right bg-white rounded mt-1 mb-2 py-2 px-2';
      } else {
        this.style = 'text-left bg-white rounded mt-1 mb-2 py-2 px-2';
      }
    });
  }

}
