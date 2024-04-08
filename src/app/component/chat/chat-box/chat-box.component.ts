import { Component, OnInit } from '@angular/core';
import { GetLoggedInUserDetailI, GetMessageI, ResponseGI, ResponseIterableI } from '../../../response/responseG.response';
import { ChatBoxI, MessageI } from '../../../model/chat.model';
import { GetMessagePaginationI } from '../../../model/pagination.model';
import { Notification } from '../../../model/notification.model';
import { ReceiveNotificationI } from '../../../response/notification.response';
import { HttpHeaders } from '@angular/common/http';
import { ComponentBase } from '../../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../../shared/constants/apiRoutes.constant';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent extends ComponentBase implements OnInit {

  public messageList: MessageI[] = [];
  public recevierId: number = -1;
  public message: string = '';
  private receiverStystemToken:string='';

  constructor(public _utilService: UtilService, private firebaseService:FirebaseService) {
    super();
  }
  ngOnInit(): void {
    this._utilService.getChatByIdE.subscribe(
      (receiverId: number) => {
        this.recevierId = receiverId;
        this.getChatById(receiverId);
      }
    )
  }

  public sendMessage() {
    console.log(this.message);
    if (this.message.trim().length > 0) {
      const data: { message: string } = {
        message: this.message.trim()
      }
      this.postAPICallPromise<{ message: string }, GetLoggedInUserDetailI<null>>(APIRoutes.sendMessage(this.recevierId), data, this.headerOption).then(
        (res) => {
          this.getChatById(this.recevierId);
          this.firebaseService.sendNotification({receiverSystemToken: this.receiverStystemToken, title: "WhatsApp", body: this.message});
        }
      )
      this.message = '';
    }
    
  }


  // private sendNotification(){
  //   this.headerOption.isSendNotification = true;

  //   const notification: Notification = {
  //     notification: {
  //       title: 'whatsaap',
  //       body: "new message"
  //     },
  //     to:this.receiverStystemToken
  //   }
  //   this.postAPICallPromise<Notification,ReceiveNotificationI>(APIRoutes.sendNotification,notification,this.headerOption).then(
  //     (res)=>{
  //       console.log(res);
  //     }
  //   )
  // }


  private getChatById(id: number) {
    const options: GetMessagePaginationI = {
      isPagination: false,
      index: 1,
      take: 140,
      search: ""
    }
    this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(id), options, this.headerOption).then(
      (res) => {
        this.messageList = res.data.data;
        this.receiverStystemToken=res.data.systemToken;
      }
    )
  }



}
