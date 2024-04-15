import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ChatBoxC, ChatBoxI } from '../../../model/chat.model';
import { ResponseGI, ResponseIterableI } from '../../../response/responseG.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { NumberString } from '../../../model/util.model';
import { IGetAllUser, UserI } from '../../../response/user.response';
import { IEmplyeeOptions } from '../../../model/option.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent extends ComponentBase implements OnInit {

  public chatBoxList: ChatBoxI[] = [];
  public allUserList: IGetAllUser[] = [];
  public searchResult: IGetAllUser[] = [];
  public searchUser: string = "";

  constructor(public _utilService: UtilService,private elementRef: ElementRef) {
    super();
    this._utilService.refreshChatListE.subscribe(
      (res) => {
        this.getChatBox();
      }
    )
    this._utilService.increaseChatCountE.subscribe(
      (data: NumberString) => {
        this.increaseChatCountF(data);
      }
    )

    _utilService.updateChatWhenSendingE.subscribe((msg: string) => {
      this.increaseChatCntOnSendingF(msg);
    })
  }

  ngOnInit(): void {
    this._utilService.getLoggedInUserDetialsF().then(
      (res) =>{
        this._utilService.loggedInUserId = res.data.id;
        this._utilService.loggedInUserName = res.data.name;
        this.getAllUser();
        this.getChatBox();
      }
    )
  }


  public getChats(id: number, allChat: string, index: number) {

    this.chatBoxList[index].newMessages = 0;
    this._utilService.currentOpenedChat = id;
    this._utilService.chatClickedE.emit(id);
    // to display name in chat header
    this._utilService.updateNameInChat.emit(allChat);
  }

  public getSearchedUserChats(user: IGetAllUser) {
    this.searchResult = [];
    this.searchUser = "";
    
    let isAlreadyExists: boolean = false;
    for (let userChats of this.chatBoxList) {
      if (userChats.recieverId == user.id) {
        isAlreadyExists = true;
        this._utilService.isAlreadyExists = true;
        this._utilService.showSearchedChatE.emit(user.id);
        this._utilService.updateNameInChat.emit(userChats.recieverName);
        this._utilService.currentOpenedChat = user.id;
        break;
      }
      else if (userChats.employeeId == user.id) {
        this._utilService.isAlreadyExists = true;
        isAlreadyExists = true;
        this._utilService.showSearchedChatE.emit(user.id);
        this._utilService.updateNameInChat.emit(userChats.employeeName);
        this._utilService.currentOpenedChat = user.id;
        break;
      }
      else {
        this._utilService.isAlreadyExists = false;
      }
    }
    if (!isAlreadyExists) {
      this._utilService.showSearchedUserNameInChatHeaderE.emit(user);
    }
  }

  public onSearch() {
    this.searchResult = this.filterSearch(this.searchUser);
  }


  private filterSearch(str: string): IGetAllUser[] {
    if (str == "") {
      return [];
    }
    return this.allUserList.filter(
      (user) => user.employeeName.toLowerCase().includes(str)
    );
  }

  private getChatBox() {
    this.getAPICallPromise<ResponseIterableI<ChatBoxI[]>>(APIRoutes.getChatBox, this.headerOption).then(
      (res) => {
        this.chatBoxList = res.iterableData;
      }
    )
  }


  private increaseChatCntOnSendingF(str: string) {
    console.log(str, this._utilService.currentOpenedChat);
    this.chatBoxList.map(
      (chat: ChatBoxI, i: number) => {
        if (chat.employeeId == this._utilService.currentOpenedChat) {
          chat.lastMessage = str;

          const newChat = chat;
          this.chatBoxList.splice(i, 1);
          this.chatBoxList.unshift(newChat);
        }
        else {
          if (chat.recieverId == this._utilService.currentOpenedChat) {
            chat.lastMessage = str;

            const newChat = chat;
            this.chatBoxList.splice(i, 1);
            this.chatBoxList.unshift(newChat);
          }
        }
      }
    )
  }


  private increaseChatCountF(data: NumberString) {
    this.chatBoxList.map(
      (chat: ChatBoxI, i: number) => {
        if (chat.employeeId == data.id) {
          chat.newMessages++;
          chat.lastMessage = data.data;
          const newChat = chat;
          this.chatBoxList.splice(i, 1);
          this.chatBoxList.unshift(newChat);
        }
        else {
          if (chat.recieverId == data.id) {
            chat.newMessages++;
            chat.lastMessage = data.data;
            const newChat = chat;
            this.chatBoxList.splice(i, 1);
            this.chatBoxList.unshift(newChat);
          }
        }
      }
    )
  }

  private getAllUser() {
    const options: IEmplyeeOptions = {
      isPagination: false,
      index: 0,
      take: 0,
      search: "",
      orders: 0,
      orderBy: ""
    }

    this.postAPICallPromise<IEmplyeeOptions, ResponseIterableI<IGetAllUser[]>>(APIRoutes.getAllEmployee, options, this.headerOption).then(
      (res) => {
        this.allUserList = res.iterableData.filter((user) => this._utilService.loggedInUserId != user.id);
      }
    )
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event: MouseEvent) {
    // const clickedElement = event.target as HTMLElement;
    // const dropdown = this.elementRef.nativeElement.querySelector('.dropdown');
    // if (!dropdown || (!dropdown.contains(clickedElement))) {
    //   this.searchResult=[];
    // }
    this.searchResult=[];
  }
}
