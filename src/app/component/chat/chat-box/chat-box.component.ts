import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GetLoggedInUserDetailI, GetMessageI, ResponseGI, ResponseIterableI } from '../../../response/responseG.response';
import { ChatBoxI, MessageI } from '../../../model/chat.model';
import { GetMessagePaginationI } from '../../../model/pagination.model';
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
  @ViewChild('scrollframe', { static: false }) scrollFrame!: ElementRef;
  @ViewChildren('item') itemElements!: QueryList<any>;
  private scrollContainer: any;

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
        this._utilService.receiverId = receiverId;
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
          this.firebaseService.sendNotification({receiverSystemToken: this.receiverStystemToken, title: "WhatsApp", body: this.message}, this._utilService.loggedInUserId);
        }
      )
      this.message = '';
    }
    
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;  
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());    
  }
  
  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private getChatById(id: number) {

    console.log(id);
    const options: GetMessagePaginationI = {
      isPagination: false,
      index: 1,
      take: 140,
      search: ""
    }

    if(this._utilService.currentOpenedChat != -1){
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(this._utilService.currentOpenedChat), options, this.headerOption).then(
        (res) => {
          this.messageList = res.data.data;
          this.receiverStystemToken=res.data.systemToken;
        }
      )
    }
  }



}
