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

// Pipes
import { DateFormatPipe } from './services/date.pipe';

// Services
import { AuthService } from './services/auth.service';
import { UploadService } from './services/upload.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';


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
    path: 'start',
    component: LandingComponent
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
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent
    ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'Scribe'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    UploadService,
    DateFormatPipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
