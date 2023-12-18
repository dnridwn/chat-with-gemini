import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request/http-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageRequestService {

  private readonly SEND_MESSAGE_ENDPOINT = '/ask'

  constructor(
    private httpRequestService: HttpRequestService
  ) { }

  send(message: string): Observable<object> {
    return this.httpRequestService.post(environment.api_url + this.SEND_MESSAGE_ENDPOINT, { message: message })
  }
}
