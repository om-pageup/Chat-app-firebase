import { EventEmitter, Injectable } from '@angular/core';
import { ChatBoxI } from '../app/model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public sendMessageE: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isListennotificationE: EventEmitter<number> = new EventEmitter<number>();
  public getChatByIdE: EventEmitter<number> = new EventEmitter<number>();
  public getChat: EventEmitter<ChatBoxI> = new EventEmitter<ChatBoxI>();
  
  public chatClickedE: EventEmitter<number> = new EventEmitter<number>();
  public increaseChatCountE: EventEmitter<number> = new EventEmitter<number>();


  public loggedInUserId: number = -1;
  public receiverId: number = -1;
  public currentOpenedChat: number = -1;

  constructor() { }
}
