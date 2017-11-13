import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  isNavbarCollapsed: boolean;
  constructor() {
    this.closeNavbar();
    console.log("isNavbarCollapsed- ",this.isNavbarCollapsed);
  }

  ngOnInit() {

    this.closeNavbar();
  }

  closeNavbar(){
    this.isNavbarCollapsed = true;
  }
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

}
