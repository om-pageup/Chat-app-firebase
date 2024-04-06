import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ComponentBase } from '../shared/class/ComponentBase.class';
import { GetLoggedInUserDetailI } from './response/responseG.response';
import { UserI } from './response/user.response';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends ComponentBase implements OnInit {

  title = 'QuickChat';
  constructor(private firebaseService: FirebaseService,private _utilService: UtilService) {
    super();
    this.firebaseService.requestPermission();
    this.firebaseService.listen();

    // setTimeout(() => {
    //   // firebaseService.sendNotification({});
    // }, 5000);
  }

  ngOnInit(): void {
    if(localStorage.getItem("jwtToken")){
     this.getLoggedInUserId();
    }
   }
 
   private getLoggedInUserId(){
     this.getAPICallPromise<GetLoggedInUserDetailI<UserI>>('/userDetails', this.headerOption).then(
       (res) =>{
         console.log(res.data.id);
         this._utilService.loggedInUserId = res.data.id;
       }
     )
   }
}
