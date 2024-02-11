import { CodeFormatterService } from '../../services/code-formatter/code-formatter.service';
import { HighlightJS } from 'ngx-highlightjs';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../domains/message';
import { catchError, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../environments/environment';
import { HttpRequestService } from '../../services/http-request/http-request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  @ViewChild('chatContainer', {static: false}) private chatContainer!: ElementRef;

  public messages: Array<Message> = [];
  public waitingResponse: boolean = false;
  public messageForm = new FormGroup({
    message: new FormControl<string>('', Validators.required)
  })

  constructor(
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
    private codeFormatterService: CodeFormatterService,
    private highlightJS: HighlightJS,
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService
  ) {
    this.highlightJS.debugMode()
  }

  send() {
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

    this.httpRequestService.post(`${environment.api_url}/send`, { message })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messageService.create('error', error?.error?.message || 'Something went wrong!');
          this.waitingResponse = false;
          this.cdr.detectChanges();
          throw error
        }),
        finalize(() => {
          this.waitingResponse = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.highlight();
            this.scrollChatToBottom();
          }, 100);
        })
      )
      .subscribe((responseData: any) => {
        if (responseData.error) return;
        this.addMessage({
          avatarIcon: 'google',
          author: 'Gemini AI',
          content: this.format(responseData.data?.response)
        });
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

  format(text: string): string {
    text = this.codeFormatterService.formatCode(text);
    text = this.codeFormatterService.formatBoldText(text);
    return text;
  }

  highlight() {
    const codeEls = this.elementRef.nativeElement.querySelectorAll('pre code') as Array<HTMLElement>;
    for (let codeEl of codeEls) {
      this.highlightJS.hljs?.highlightElement(codeEl);
    }
  }

  ngOnInit(): void {
  }

}
