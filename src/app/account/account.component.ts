import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UploadService } from '../services/upload.service';

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
  uid;

  filename = 'Change Picture';
  inputFile;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Account');
    this.auth.getAuthState().subscribe(
      currentuser => {
        if (currentuser) {
          this.userService.retrieveUserDocument(currentuser.uid).subscribe(
            user => {
              if (user) {
                this.displayName = user.displayName;
                this.userName = user.userName;
                this.photoURL = user.photoURL;
                this.status = user.status;
                this.uid = user.uid;
              }
            });
        } else {
          this.router.navigateByUrl('start');
        }
      });
  }

  update() {
    this.auth.updateUser(this.displayName, this.userName, this.status).then(
      () => console.log('User details updated'));
  }

  processImage(event) {
    this.inputFile = event.target.files[0];
    this.filename = this.inputFile.name;
    if (this.inputFile.size > 2000000) {
      this.filename = 'Max Filesize 2Mb!';
    } else {
      if (this.filename.length > 25) {
        this.filename = this.filename.slice(0, 25) + '...' + this.filename.slice(this.filename.length - 3);
      }
      this.uploadService.pushUpload(this.inputFile, 'user', this.uid);
    }
  }

}
