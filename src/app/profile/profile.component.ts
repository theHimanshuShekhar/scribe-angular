import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  showAddPost: boolean;

  username: string;
  userCollection: AngularFirestoreCollection<any>;
  userObs: Observable<any>;
  user: any;

  // Vars to display on profile page
  useruid: string;
  photoURL = '../../assets/images/default-profile.jpg';
  status: string;
  displayName: string;

  // If User exists
  doesUserExist = true;

  constructor(
    public auth: AuthService, private afs: AngularFirestore, private route: ActivatedRoute, private postsService: PostsService) {
  }


   ngOnInit() {
      this.route.paramMap.subscribe(params => {
      this.username = params.get('username');



      // Retrieve user collection
      this.userCollection = this.afs.collection('users', ref => ref.where('userName', '==', this.username));
      this.userObs = this.userCollection.valueChanges();
      this.userObs.forEach(user => {
        if (user) {
          this.user = user;
          this.useruid = this.user[0].uid;
          this.photoURL = this.user[0].photoURL;
          this.displayName = this.user[0].displayName;
          this.status = this.user[0].status;
        }

        // Check if current user is profile user
        this.auth.getAuthState().subscribe(auth => {
          if ( auth.uid === this.useruid) {
            this.showAddPost = true;
          } else {
            this.showAddPost = false;
          }
        });
      })
      .catch(
        (err) => {
          console.log('User does not exist');
          this.doesUserExist = false;
        }
      );
    });
  }
}
