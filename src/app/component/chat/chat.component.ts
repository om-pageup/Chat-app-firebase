import { Component } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  public showChatMessages: boolean = false;

  constructor(public _utilService: UtilService) {
    this._utilService.getChatByIdE.subscribe(
      (receiverId: number) => {
        if (receiverId > -1)
          this.showChatMessages = true;
        else
          this.showChatMessages = false;
      }
    )
  }

}
