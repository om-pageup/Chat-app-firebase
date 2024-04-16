import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ChatBoxI } from '../../../model/chat.model';
import { ResponseIterableI } from '../../../response/responseG.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { NumberString } from '../../../model/util.model';
import { IGetAllUser } from '../../../response/user.response';
import { IEmplyeeOptions } from '../../../model/option.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent extends ComponentBase implements OnInit, OnDestroy {

  public chatBoxList: ChatBoxI[] = [];
  public allUserList: IGetAllUser[] = [];
  public searchResult: IGetAllUser[] = [];
  public searchUser: string = "";
  public selectedIndex: number = -1;
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();
  private options: IEmplyeeOptions = {
    isPagination: false,
    index: 0,
    take: 0,
    search: "",
    orders: 0,
    orderBy: ""
  }

  constructor(public _utilService: UtilService) {
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

    this._utilService.updateChatWhenSendingE.subscribe((msg: string) => {
      this.increaseChatCntOnSendingF(msg);
    })
  }

  ngOnInit(): void {
    this._utilService.getLoggedInUserDetialsF().then(
      (res) => {
        this._utilService.loggedInUserId = res.data.id;
        this._utilService.loggedInUserName = res.data.name;
        this.getChatBox();
      }
    )



    this.userSearchSubject.pipe(
      debounceTime(0),
    ).subscribe(
      (userName) => {
        this.onDestroy$.next();
        this.options.search = userName;
        this._utilService.search(this.options).pipe(
          takeUntil(this.onDestroy$),
        ).subscribe(
          (res) => {
            this.searchResult = res.iterableData.filter((user) => this._utilService.loggedInUserId != user.id);
          }
        )
      }
    )
  }


  public getChats(id: number, name: string, chat: ChatBoxI) {
    const userChat: { id: number, name: string } = {
      id,
      name
    }
    chat.newMessages = 0;
    this._utilService.userChatEmitter.emit(userChat);
  }

  public onArrowDown() {
    if (this.selectedIndex == this.searchResult.length - 1) {
      this.selectedIndex = 0;
    }
    else {
      this.selectedIndex++;
    }
  }

  public onArrowUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }
  public onEnter() {
    const userChat: { id: number, name: string } = {
      id: this.searchResult[this.selectedIndex].id,
      name: this.searchResult[this.selectedIndex].employeeName
    }
    this._utilService.userChatEmitter.emit(userChat);
    this.searchResult = [];
    this.searchUser = "";
    this.selectedIndex = -1;
  }

  public getSearchedUserChats(user: IGetAllUser) {
    const obj: { id: number, name: string } = {
      id: user.id,
      name: user.employeeName
    }

    this._utilService.userChatEmitter.emit(obj);
    this.searchResult = [];
    this.searchUser = "";
  }

  public onSearch() {
    this.userSearchSubject.next(this.searchUser);
  }

  private getChatBox() {
    this.getAPICallPromise<ResponseIterableI<ChatBoxI[]>>(APIRoutes.getChatBox, this.headerOption).then(
      (res) => {
        this.chatBoxList = res.iterableData;
      }
    )
  }


  private increaseChatCntOnSendingF(str: string) {
    let isChatExists = false;
    this.chatBoxList.map(
      (chat: ChatBoxI, i: number) => {
        if (chat.employeeId == this._utilService.currentOpenedChat) {
          isChatExists = true;
          chat.lastMessage = str;

          const newChat = chat;
          this.chatBoxList.splice(i, 1);
          this.chatBoxList.unshift(newChat);
        }
        else {
          if (chat.recieverId == this._utilService.currentOpenedChat) {
            chat.lastMessage = str;
            isChatExists = true;
            const newChat = chat;
            this.chatBoxList.splice(i, 1);
            this.chatBoxList.unshift(newChat);
          }
        }
      }
    )

    if (!isChatExists) {
      this.getAPICallPromise<ResponseIterableI<ChatBoxI[]>>(APIRoutes.getChatBox, this.headerOption).then(
        (res) => {
          this.chatBoxList = res.iterableData;
        }
      )
    }
  }


  private increaseChatCountF(data: NumberString) {
    this.chatBoxList.map(
      (chat: ChatBoxI, i: number) => {
        console.log(chat);
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

  @HostListener('document:click', ['$event'])
  public handleClick(event: MouseEvent) {
    this.searchResult = [];
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
