import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../domains/message';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../environments/environment';
import { ServerSentEventService } from '../../services/server-sent-event/server-sent-event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  @ViewChild('chatContainer', {static: false}) private chatContainer!: ElementRef;

  public messages: Message[] = [];
  public waitingResponse: boolean = false;
  public messageForm = new FormGroup({
    message: new FormControl<string>('', Validators.required)
  })

  constructor(
    private messageService: NzMessageService,
    private serverSentEventService: ServerSentEventService,
    private cdr: ChangeDetectorRef
  ) {}

  sendWithStream() {
    if (!this.messageForm.valid) return
    if (this.waitingResponse) return;
    this.waitingResponse = true;

    const message = this.messageForm.get('message')?.value || '';
    this.resetInputMessage();

    this.addMessage({
      avatarIcon: 'user',
      author: 'You',
      content: message
    });

    let messageIndex: number = -1;
    this.serverSentEventService.create(environment.api_url + "/send?message=" + message)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messageService.create('error', error?.error?.message || 'Something went wrong!');
          this.waitingResponse = false;
          this.cdr.detectChanges();
          throw error
        })
      )
      .subscribe((responseData) => {
        if (responseData.error || responseData.data?.is_eof) {
          this.serverSentEventService.close();
          this.waitingResponse = false;
          this.cdr.detectChanges();
          return;
        }

        if (messageIndex < 0) {
          messageIndex = this.addMessage({
            avatarIcon: 'google',
            author: 'Gemini AI',
            content: ""
          });
        }

        this.messages[messageIndex].content += responseData.data?.response;
        this.scrollChatToBottom();
        this.cdr.detectChanges();
      });
  }

  resetInputMessage() {
    this.messageForm.get('message')?.reset()
  }

  addMessage(data: Message): number {
    this.messages = [...this.messages, data];
    this.scrollChatToBottom();
    return this.messages.length - 1;
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
