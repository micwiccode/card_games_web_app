import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).tokenValue}`,
  });
  private API_URL: string = environment.API_URL;
  constructor(private http: HttpClient, private router: Router) {}

  sendMessage(message, roomID) {
    const body = { message: message };
    return this.http
      .post(`${this.API_URL}/room/${roomID}/sendMessage`, body, {
        headers: this.header,
      })
      .pipe();
  }
}
