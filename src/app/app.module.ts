import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './component/register/register.component';
import { ChatBoxComponent } from './component/chat/chat-box/chat-box.component';
import { ChatListComponent } from './component/chat/chat-list/chat-list.component';
import { ChatComponent } from './component/chat/chat.component';
import { LoginComponent } from './component/login/login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { addTokenInterceptor } from './interceptor/add-token.interceptor';
import { AuthInterceptor } from './interceptor/auth.interceptor';

initializeApp(environment.firebase);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    ChatListComponent,
    ChatBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    ToastrModule.forRoot(),
    // provideFirebaseApp(() => initializeApp({"projectId":"quickchat-8b689","appId":"1:982998485573:web:5905fab3218b835412f12c","databaseURL":"https://quickchat-8b689-default-rtdb.asia-southeast1.firebasedatabase.app","storageBucket":"quickchat-8b689.appspot.com","apiKey":"AIzaSyCO9c-bHNkZLUQeStyQS3B_FdU9Ae6W2C0","authDomain":"quickchat-8b689.firebaseapp.com","messagingSenderId":"982998485573","measurementId":"G-ZLZ8HHMJCX"})),
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging())
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
