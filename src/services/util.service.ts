import { EventEmitter, Injectable } from '@angular/core';
import { ChatBoxI } from '../app/model/chat.model';
import { NumberString } from '../app/model/util.model';
import { IGetAllUser } from '../app/response/user.response';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

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


  public isAlreadyExists: boolean = false;
  public loggedInUserId: number = -1;
  public receiverId: number = -1;
  public currentOpenedChat: number = -1;

  constructor() { }
}
