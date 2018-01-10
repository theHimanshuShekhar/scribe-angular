import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  
  photoURL;
  userName = 'Enter Username';
  displayName = 'Enter Displayname';
  status = 'Enter status';

  filename = 'Change Picture';

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(
      currentuser => {
        if (currentuser) {
          this.userService.retrieveUserDocument(currentuser.uid).subscribe(
            user => {
              this.displayName = user.displayName;
              this.userName = user.userName;
              this.photoURL = user.photoURL;
              this.status = user.status;
            });
        } else {
          this.router.navigateByUrl('start');
        }
      });
  }

  processImage(event) {
    const file = event.target.files[0];
    this.filename = file.name;
    if (this.filename.length > 20) {
      this.filename = this.filename.slice(0,20) + '...' + this.filename.slice(this.filename.length - 3);
    }
  }

}
