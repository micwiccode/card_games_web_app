import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  header = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getUser() {
    return this.http
      .get('/getUser', { headers: this.header })
      .pipe();
  }

  updateUser(user) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .put('/updateUser', user, { headers: this.header })
      .pipe();
  }
}
