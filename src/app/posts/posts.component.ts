import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {

  posts: Observable<any[]>;
  constructor(private db: AngularFirestore) {
    this.getPosts();
  }

  private getPosts(){
    this.posts = this.db.collection('posts').valueChanges();
  }
  ngOnInit() {
  }


}
