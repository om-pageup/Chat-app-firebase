import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
initializeApp(environment.firebase);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // provideFirebaseApp(() => initializeApp({"projectId":"quickchat-8b689","appId":"1:982998485573:web:5905fab3218b835412f12c","databaseURL":"https://quickchat-8b689-default-rtdb.asia-southeast1.firebasedatabase.app","storageBucket":"quickchat-8b689.appspot.com","apiKey":"AIzaSyCO9c-bHNkZLUQeStyQS3B_FdU9Ae6W2C0","authDomain":"quickchat-8b689.firebaseapp.com","messagingSenderId":"982998485573","measurementId":"G-ZLZ8HHMJCX"})),
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
