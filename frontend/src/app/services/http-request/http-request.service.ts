import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(
    private http: HttpClient
  ) { }

  post(url: string, requestBody: any): Observable<object> {
    return this.http.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  get(url: string, params: any = null): Observable<object> {
    return this.http.get(url, {
      params
    })
  }
}
