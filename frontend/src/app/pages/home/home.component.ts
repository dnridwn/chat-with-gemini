import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../domains/message';
import { MessageRequestService } from '../../services/message-request/message-request.service';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  @ViewChild('chatContainer', {static: false}) private chatContainer!: ElementRef;

  public messages: Message[] = [];
  public message!: string;
  public waitingResponse: boolean = false;

  constructor(
    private messageRequestService: MessageRequestService
  ) {}

  send() {
    if (this.waitingResponse) return;
    this.waitingResponse = true;

    const message = this.message;
    this.resetInputMessage();

    this.addMessage({
      avatarIcon: 'user',
      author: 'You',
      content: message
    })
    this.scrollChatToBottom();

    this.messageRequestService.send(message)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          throw error
        })
      )
      .subscribe((response: any) => {
        this.waitingResponse = false;
        const responseMessage = response?.data?.response
        if (responseMessage) {
          this.addMessage({
            avatarIcon: 'google',
            author: 'Gemini AI',
            content: responseMessage
          })
          this.scrollChatToBottom();
        }
      })
  }

  resetInputMessage() {
    this.message = '';
  }

  addMessage(data: Message) {
    this.messages = [...this.messages, data]
  }

  scrollChatToBottom() {
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scroll({
          top: this.chatContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      }, 100)
    } catch(err) {
      console.error(err)
    }     
  }

  ngOnInit(): void {
  }

}