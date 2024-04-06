import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'QuickChat';
  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.requestPermission();
    this.firebaseService.listen();

    setTimeout(() => {
      this.firebaseService.sendNotification()
    }, 5000);
  }
}
