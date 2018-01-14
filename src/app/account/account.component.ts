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
  
  photoURL = '../../assets/images/default-profile.jpg';
  userName = 'Enter Username';
  displayName = 'Enter Displayname';
  status = 'Enter status';

  filename = 'Change Picture';
  inputFile;

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

  update() {
    this.auth.updateUser(this.displayName, this.userName, this.status).then(
      () => { console.log('User details updated') });
    if (this.inputFile) {
      alert('Photo upload not implemented');
    }
  }

  processImage(event) {
    this.inputFile = event.target.files[0];
    this.filename = this.inputFile.name;
    if (this.filename.length > 25) {
      this.filename = this.filename.slice(0,25) + '...' + this.filename.slice(this.filename.length - 3);
    }
  }

}
