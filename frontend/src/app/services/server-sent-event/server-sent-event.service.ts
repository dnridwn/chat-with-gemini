import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerSentEventService {

  private eventSource!: EventSource;

  constructor() { }

  create(url: string): Observable<any> {
    this.eventSource = new EventSource(url);
    return new Observable(observer => {
      this.eventSource.onmessage = (event: any) => {
        const messageData = JSON.parse(event.data);
        observer.next(messageData);
      }
      this.eventSource.onerror = (event: any) => {
        observer.error(event)
      }
    });
  }

  close() {
    if (!(this.eventSource instanceof EventSource)) return;
    this.eventSource.close();
  }
}