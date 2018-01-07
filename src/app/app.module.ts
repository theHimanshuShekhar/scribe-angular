import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as firebase from 'firebase';

// Pipes
import { DateFormatPipe } from './services/date.pipe';

// Services
import { PostsService } from './services/posts.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UploadService } from './services/upload.service';

// Components
import { AppComponent } from './app.component';


firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    DateFormatPipe,
    ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-fire-project'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    RouterModule.forRoot([
    ])
  ],
  providers: [
    PostsService,
    AuthService,
    UserService,
    UploadService,
    MessageService,
    DateFormatPipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }

