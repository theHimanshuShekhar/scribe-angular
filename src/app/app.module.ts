import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { FormsModule } from '@angular/forms';

// Services
import { PostsService } from './services/posts.service';
import { AuthService } from './services/auth.service';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { FooterComponent } from './footer/footer.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountComponent } from './account/account.component';
import { AddPostComponent } from './add-post/add-post.component';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    UserInfoComponent,
    FooterComponent,
    PostsComponent,
    ProfileComponent,
    AccountComponent,
    AddPostComponent,
    LoginPageComponent
    ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-fire-project'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'user/:name',
        component: ProfileComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: '**',
        redirectTo: '/home'
      }
    ])
  ],
  providers: [
    PostsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

const Routes = {

};
