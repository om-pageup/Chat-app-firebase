import { EventEmitter, Injectable } from '@angular/core';
import { ChatBoxI } from '../app/model/chat.model';
import { NumberString } from '../app/model/util.model';
import { IGetAllUser, UserI } from '../app/response/user.response';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { GetLoggedInUserDetailI } from '../app/response/responseG.response';

@Injectable({
  providedIn: 'root'
})
export class UtilService extends ComponentBase {

  public sendMessageE: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isListennotificationE: EventEmitter<number> = new EventEmitter<number>();
  public getChatByIdE: EventEmitter<number> = new EventEmitter<number>();
  public updateNameInChat: EventEmitter<string> = new EventEmitter<string>();
  
  public chatClickedE: EventEmitter<number> = new EventEmitter<number>();
  public increaseChatCountE: EventEmitter<NumberString> = new EventEmitter<NumberString>();
  public showUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showSearchedUserNameInChatHeaderE: EventEmitter<IGetAllUser> = new EventEmitter<IGetAllUser>();
  public showSearchedChatE: EventEmitter<number> = new EventEmitter<number>();
  public refreshChatListE: EventEmitter<boolean> = new EventEmitter<boolean>();
  public updateChatWhenSendingE: EventEmitter<string> = new EventEmitter<string>();

  // public unreadMsgCount: number = 0;
  public isAlreadyExists: boolean = false;
  public loggedInUserId: number = -1;
  public loggedInUserName: string = "";
  public receiverId: number = -1;
  public currentOpenedChat: number = -1;

  public getLoggedInUserDetialsF() {
    return this.getAPICallPromise<GetLoggedInUserDetailI<UserI>>('/userDetails', this.headerOption);
  }

}
