import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

interface User {
  uid?: string;
  email?: string;
  userName?: string;
  displayName?: string;
  photoURL?: string;
  status?: string;
}

@Injectable()
export class UserService {
  user: Observable<User>;
  userCollection: AngularFirestoreCollection<any>;
  userObs: Observable<any>;

  constructor() { }

}
