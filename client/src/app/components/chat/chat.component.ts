import { AfterViewChecked, Component, OnInit, Input } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from 'src/environments/environment';
import {PanGameService} from "../../services/pan-game.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})

export class ChatComponent implements OnInit, AfterViewChecked {
  @Input() roomID: number;
  @Input() userName: string;
  chatMessages = [];
  chatMessage = '';
  chatBox = null;

  constructor(
    private chatService: ChatService,
    private panGameService: PanGameService
  ) {}

  ngOnInit(): void {
    this.initWebSocketChat();
    console.log(this.userName)
  }

  ngAfterViewChecked(): void {
    this.chatBox = document.querySelector('.chatBox');
  }

  initWebSocketChat() {
    this.panGameService
      .getServerSendEvent(
        `${environment.MERCURE_URL}/.well-known/mercure?topic=chat/${this.roomID}`
      )
      .subscribe(data => {
        // @ts-ignore
        const msg = JSON.parse(data.data);
        if (msg.sender !== this.userName) {
          this.chatMessages.push(msg);
        }
      });
  }
  openChatBox() {
    this.chatBox.style.transform = `translateX(${this.chatBox.offsetWidth}px)`;
  }

  closeChatBox() {
    this.chatBox.style.transform = `translateX(-${this.chatBox.offsetWidth}px)`;
  }

  onMessageSubmit() {
    this.chatMessages.push({message: this.chatMessage, sender: this.userName});
    this.chatService.sendMessage(this.chatMessage, this.roomID).subscribe();
    this.chatMessage = '';
  }
}
