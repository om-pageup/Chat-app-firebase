import { Component, OnInit } from '@angular/core';
import { ChatBoxI } from '../../../model/chat.model';
import { ResponseGI, ResponseIterableI } from '../../../response/responseG.response';
import { ComponentBase } from '../../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../../shared/constants/apiRoutes.constant';
import { NumberString } from '../../../model/util.model';
import { UserI } from '../../../response/user.response';
import { IEmplyeeOptions } from '../../../model/option.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent extends ComponentBase implements OnInit {

  public chatBoxList: ChatBoxI[] = [];

  constructor(public _utilService: UtilService) {
    super();

    _utilService.increaseChatCountE.subscribe(
      (data: NumberString) => {
        this.chatBoxList.map(
          (chat) => {
            if (chat.employeeId == data.id) {
              chat.newMessages++;
              chat.lastMessage = data.data;
            }
          }
        )
      }
    )
  }

  ngOnInit(): void {
    this.getChatBox();
  }


  public getChats(id: number, allChat: ChatBoxI, index: number) {

    this.chatBoxList[index].newMessages = 0;

    this._utilService.currentOpenedChat = id;
    this._utilService.chatClickedE.emit(id);
    this._utilService.getChat.emit(allChat);
  }

  private getChatBox() {
    this.getAPICallPromise<ResponseIterableI<ChatBoxI[]>>(APIRoutes.getChatBox, this.headerOption).then(
      (res) => {
        this.chatBoxList = res.iterableData;
      }
    )
    const options: IEmplyeeOptions = {
      isPagination: false,
      index: 0,
      take: 0,
      search: "",
      orders: 0,
      orderBy: ""
    }

    // this.postAPICallPromise<IEmplyeeOptions, ResponseIterableI<UserI[]>>(APIRoutes.getAllEmployee,options, this.headerOption).then(
    //   (res) => {
    //     console.log(res);
    //   }
    // )
  }

}
