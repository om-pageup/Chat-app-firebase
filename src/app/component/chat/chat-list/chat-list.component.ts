import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ChatBoxC, ChatBoxI } from '../../../model/chat.model';
import { ResponseGI, ResponseIterableI } from '../../../response/responseG.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { NumberString } from '../../../model/util.model';
import { IGetAllUser, UserI } from '../../../response/user.response';
import { IEmplyeeOptions } from '../../../model/option.model';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

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
  // private getSearchedUser!: Observable<ResponseIterableI<IGetAllUser[]>>;

  constructor(public _utilService: UtilService, private elementRef: ElementRef) {
    super();

    // this.getSearchedUser = this._httpClient.post<ResponseIterableI<IGetAllUser[]>>(`${this.baseUrl}${APIRoutes.getAllEmployee}`, this.options);

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
      (res) => {
        this._utilService.loggedInUserId = res.data.id;
        this._utilService.loggedInUserName = res.data.name;
        this.getChatBox();
      }
    )



    this.userSearchSubject.pipe(
      debounceTime(2000),
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


  public getChats(id: number, allChat: string, index: number) {

    this.chatBoxList[index].newMessages = 0;
    this._utilService.currentOpenedChat = id;
    this._utilService.chatClickedE.emit(id);
    // to display name in chat header
    this._utilService.updateNameInChat.emit(allChat);
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
    this.getSearchedUserChats(this.searchResult[this.selectedIndex]);
    this.selectedIndex = -1;
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

  @HostListener('document:click', ['$event'])
  public handleClick(event: MouseEvent) {
    this.searchResult = [];
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
