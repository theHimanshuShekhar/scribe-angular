import { Injectable, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {

  public user;
  private avatar: string;
  private username: string;

  constructor(private auth: AuthService) {
    this.auth.getAuthState().subscribe(
      () => {
        this.user = this.auth.getUser();
      });
  }

  public getAvatar() {
    if(this.user) {
      return this.avatar = this.user.photoURL;
    }
  }
  public getUsername() {
    if(this.user) {
      return this.username = this.user.displayName;
    }
  }
}
