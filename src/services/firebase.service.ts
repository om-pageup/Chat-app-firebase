import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private http: HttpClient) { }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey }).then(
        (currentToken) => {
          if (currentToken) {
            console.log("Hurraaa!!! we got the token.....");
            console.log(currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // this.message = payload;
    });
  }


  sendNotification(obj: { receiverSystemToken: string, title: string, body: string }) {

    console.log("sendNotification");

    const url = 'https://fcm.googleapis.com/fcm/send';
    const data = {
      notification: {
        title: obj.title,
        body: obj.body
      },
      to: "evYn0J-ZlKVE6KXM5sgUVh:APA91bHzYE9k9Mv0DGjldPFxulnCHJcZBEEBwN-p45hQntMN6vuqthowNZYTtaoMYjvvqhCZcZFnq_7EDS1nfgNgYvTPPwwV6TMVla1vRg55jHqe_Xx0mUTM6v2SEr5A4Tv0dDvgRCBx"
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'key=AAAA5N9GikU:APA91bE6i7bh3atMvh671HBpD7ab3H6BHG9qbwJHpNOeING93nOfRCHt-XHdoGFcOujelFyN1EGleLaWoCFquNQxRkWFLwM6d_PIoloeJh7Ngtw2J0z5kOufWtx8Lz3OLIHTx7in8oD1',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
  // sendNotification() {
  //   const payload = {
  //     "notification": {
  //       "title": "First Notification",
  //       "body": "Hello from satyasssssm!!"
  //     },
  //     "to": "evYn0J-ZlKVE6KXM5sgUVh:APA91bHzYE9k9Mv0DGjldPFxulnCHJcZBEEBwN-p45hQntMN6vuqthowNZYTtaoMYjvvqhCZcZFnq_7EDS1nfgNgYvTPPwwV6TMVla1vRg55jHqe_Xx0mUTM6v2SEr5A4Tv0dDvgRCBx"
  //   };
  //   const myHeader = new HttpHeaders({
  //     "Authorization": "key=AAAA5N9GikU:APA91bE6i7bh3atMvh671HBpD7ab3H6BHG9qbwJHpNOeING93nOfRCHt-XHdoGFcOujelFyN1EGleLaWoCFquNQxRkWFLwM6d_PIoloeJh7Ngtw2J0z5kOufWtx8Lz3OLIHTx7in8oD1",
  //     "skip": "true"
  //   })
  //   this.http.post('https://fcm.googleapis.com/fcm/send', payload, { headers: myHeader }).subscribe(s => console.log(s));
  // }
}
