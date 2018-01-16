import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Input() userURL: string;

  buttonsClass = 'col-12 mt-2 d-none';
  textareaClass = 'form-control col-10';

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if (!this.userURL) {
      this.userURL = '../../assets/images/default-profile.jpg';
    }
  }

  expand() {
    this.buttonsClass = 'col-12 mt-2';
    this.textareaClass = 'form-control col-10 expanded';
    console.log('expand');
  }
  contract() {
    this.buttonsClass = 'col-9 col-lg-12 mt-2 d-none';
    this.textareaClass = 'form-control col-10';
  }

}
