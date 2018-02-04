import { GroupService } from './services/group.service';
import { PostsService } from './services/posts.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import * as firebase from 'firebase';

// Pipes and Directives
import { DateFormatPipe } from './services/date.pipe';
import { DetectScrollDirective } from './directives/detect-scroll.directive';
import { LinkifyPipe } from './services/linkify.pipe';

// Services
import { AuthService } from './services/auth.service';
import { UploadService } from './services/upload.service';
import { UserService } from './services/user.service';
import { FollowService } from './services/follow.service';
import { LikesService } from './services/likes.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ErrorComponent } from './error/error.component';
import { AccountComponent } from './account/account.component';
import { PostComponent } from './post/post.component';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';
import { AddPostComponent } from './add-post/add-post.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user-list/user/user.component';
import { GroupComponent } from './group/group.component';
import { TestComponent } from './test/test.component';


firebase.initializeApp(environment.firebase);

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'user/:username',
    component: ProfileComponent
  },
  {
    path: 'post/:pid',
    component: PostComponent
  },
  {
    path: 'group/:gid',
    component: GroupComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'start',
    component: LandingComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    DateFormatPipe,
    LinkifyPipe,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ErrorComponent,
    AccountComponent,
    PostComponent,
    SearchComponent,
    AboutComponent,
    AddPostComponent,
    UserListComponent,
    UserComponent,
    DetectScrollDirective,
    GroupComponent,
    TestComponent
    ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'Scribe'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    AuthService,
    UploadService,
    UserService,
    PostsService,
    FollowService,
    LikesService,
    GroupService,
    DateFormatPipe,
    LinkifyPipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddPostComponent
  ]
})
export class AppModule { }
