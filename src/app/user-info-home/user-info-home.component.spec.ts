import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoHomeComponent } from './user-info-home.component';

describe('UserInfoHomeComponent', () => {
  let component: UserInfoHomeComponent;
  let fixture: ComponentFixture<UserInfoHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
