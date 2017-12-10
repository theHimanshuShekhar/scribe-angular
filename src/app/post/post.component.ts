import { DateFormatPipe } from './../services/date.pipe';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

  author: string = 'author';
  authorPhotoURL = '../../assets/images/default-profile.jpg';
  username: string = 'username';
  body: string = 'Body';
  date = new Date();

  constructor(
    private router: Router,
    private dateFormatPipe: DateFormatPipe,
  ) { }

  ngOnInit() {
  }

  public sendToProfile(username) {
    this.router.navigateByUrl('user/' + username);
  }

  public getDate(date) {
    setTimeout(500);
    if (date) {
      const prevDate = date;
      const newDate = new Date();
      const milliseconds: number = newDate.getTime() - prevDate.getTime();
      const minutes = Math.trunc(milliseconds / 60000);
      let hours;
      if (minutes < 59) {
        if (minutes < 1) {
          return 'just now';
        }
        return minutes + 'm';
      } else {
        hours = Math.trunc(minutes / 60);
        if (hours >= 1 && hours < 24) {
          return hours + 'h';
        } else {
          return this.dateFormatPipe.transform(prevDate);
        }
      }
    }
  }

}
