import { EventEmitter, Injectable } from '@angular/core';
import { ChatBoxI } from '../app/model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public getChatByIdE: EventEmitter<number> = new EventEmitter<number>();
  public getChat: EventEmitter<ChatBoxI> = new EventEmitter<ChatBoxI>();
  
  public loggedInUserId: number = -1;
  public receiverId: number = -1;
  public currentOpenedChat: number = -1;

  constructor() { }
}
