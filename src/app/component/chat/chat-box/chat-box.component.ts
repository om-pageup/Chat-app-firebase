import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GetLoggedInUserDetailI, GetMessageI, ResponseGI } from '../../../response/responseG.response';
import { ChatBoxI, MessageI } from '../../../model/chat.model';
import { GetMessagePaginationI } from '../../../model/pagination.model';
import { ComponentBase } from '../../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../../shared/constants/apiRoutes.constant';
import { FirebaseService } from '../../../../services/firebase.service';
import { CGetAllUser, IGetAllUser } from '../../../response/user.response';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent extends ComponentBase implements OnInit, AfterViewInit {
  @ViewChild('scrollframe', { static: false }) scrollFrame!: ElementRef;
  @ViewChildren('item') itemElements!: QueryList<any>;
  private scrollContainer: any;
  public isScrollToBottom: boolean = true;
  public isSendMsg: boolean = false
  public Name: string = "";
  public isSearchedUserChat: boolean = false;
  public searchedUserChat: CGetAllUser = new CGetAllUser();
  public preScrollH: number = 0;
  private options: GetMessagePaginationI = {
    isPagination: true,
    index: 0,
    take: 20,
    search: ""
  }
  public messageList: MessageI[] = [];
  public recevierId: number = -1;
  public message: string = '';
  private receiverStystemToken: string = '';
  public userDetail: ChatBoxI = {
    employeeId: 0,
    employeeName: '',
    lastMessage: '',
    isSeen: false,
    newMessages: 0,
    recieverId: 0,
    recieverName: '',
    lastActive: '',
  };

  public showChatMessages: boolean = false;
  public showEmojiPicker: boolean = false;

  constructor(public _utilService: UtilService, private firebaseService: FirebaseService, private http: HttpClient) {
    super();
    this.isSearchedUserChat = false;
    _utilService.chatClickedE.subscribe(
      (id: number) => {
        this.recevierId = id;
        this.getChatByIdListen(id);
        if (id > -1)
          this.showChatMessages = true;
        else
          this.showChatMessages = false;
      }
    )

  }




  ngOnInit(): void {
    this._utilService.getChatByIdE.subscribe(
      (receiverId: number) => {
        this._utilService.receiverId = receiverId;
        this.recevierId = receiverId;
        this.options.index = 0;
        this.getChatById(receiverId);
      }
    )
    this._utilService.isListennotificationE.subscribe(
      (receiverId: number) => {
        this.getChatByIdListen(receiverId);
      }
    )
    this._utilService.updateNameInChat.subscribe(
      (res) => {
        this.Name = res;
      }
    );

    this._utilService.showSearchedChatE.subscribe(
      (id: number) => {
        this.options.index = 0;
        this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(id), this.options, this.headerOption).then(
          (res) => {
            this.showChatMessages = true;
            this.isSearchedUserChat = false;
            this.messageList = res.data.data;
            this.receiverStystemToken = res.data.systemToken;
            this.isScrollToBottom = true;

          }
        )
      }
    )

    this._utilService.showSearchedUserNameInChatHeaderE.subscribe(
      (user: IGetAllUser) => {
        this.recevierId = user.id;
        this._utilService.currentOpenedChat = user.id;
        this.messageList = [];
        this.searchedUserChat = user;
        this.Name = user.employeeName;
        this.isSearchedUserChat = true;
        this.showChatMessages = true;
      }
    )

  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }

  public sendMessage() {
    this.showEmojiPicker=false;
    this.options.index = 0;
    this.isScrollToBottom = true;
    this.isSendMsg = true;
    if (this.message.trim().length > 0) {
      const data: { message: string } = {
        message: this.message.trim()
      }
      this.postAPICallPromise<{ message: string }, GetLoggedInUserDetailI<null>>(APIRoutes.sendMessage(this.recevierId), data, this.headerOption).then(
        (res) => {
          this._utilService.updateChatWhenSendingE.emit(data.message);
          if (this.isSearchedUserChat) {
            this._utilService.refreshChatListE.emit(true);
          }
          this.getChatByIdListen(this.recevierId);
          this.firebaseService.sendNotification({ receiverSystemToken: this.receiverStystemToken, title: "WhatsApp", body: data.message }, this._utilService.loggedInUserId);
        }
      )
      this.message = '';
    }
  }

  public onScrollUp(event: Event) {
    const scrolltop = this.scrollFrame.nativeElement.scrollTop;
    // const isAtBottom = this.scrollFrame.nativeElement.scrollHeight * 0.1;
    if (scrolltop == 0 && !this.isSearchedUserChat) {
      this.options.index++;
      this.getChatById(0);
    }
  }


  public deleteMessage(id: number, index: number){
    const msgtoDlt: { ids: number[] } ={
      ids: [id]
    }

    this.deleteAPICallPromise<{ ids: number[] }, GetLoggedInUserDetailI<null>>(APIRoutes.deleteMessage, msgtoDlt, this.headerOption).then(
      (res) =>{
        this.messageList.splice(index, 1);
        this.isScrollToBottom = true;
        this._toastreService.success("Message deleted successfully");
      }
    )
  }

  private onItemElementsChanged(): void {
    if (this.isScrollToBottom) {
      this.scrollToBottom();
      this.isScrollToBottom = false;
    }
    else {
      this.scrollToHalf();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
    });
  }
  private scrollToHalf(): void {


    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight - this.preScrollH,
      left: 0,
    });

    this.preScrollH = this.scrollContainer.scrollHeight;
  }

  private getChatById(id: number) {
    if (this._utilService.currentOpenedChat != -1) {
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(this._utilService.currentOpenedChat), this.options, this.headerOption).then(
        (res) => {
          if (this.isSendMsg) {
            this.messageList = [];
            this.isSendMsg = false;
          }
          for (let i = res.data.data.length - 1; i > -1; i--) {
            this.messageList.unshift(res.data.data[i]);
          }
          this.receiverStystemToken = res.data.systemToken;
        }
      )
    }
  }

  private getChatByIdListen(id: number) {
    this.options.index = 0;
    if (this._utilService.currentOpenedChat != -1) {
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(id), this.options, this.headerOption).then(
        (res) => {
          this.messageList = res.data.data;
          this.receiverStystemToken = res.data.systemToken;
          this.isScrollToBottom = true;
        }
      )
    }
  }

  public toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  public addEmoji(event: any) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
  }


}



