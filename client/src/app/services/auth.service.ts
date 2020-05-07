import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  username = null;
  header = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient, private router:Router) {}

  register(user) {
    return this.http.post('http://localhost:8000/register', user, { headers: this.header }).pipe();
  }

  logIn(user) {
    return this.http.post('/login', user, { headers: this.header }).pipe();
  }

  storeUserData(username) {
    localStorage.setItem('username', username);
    this.username = username;
  }

  logOut() {
    this.http.post('http://localhost:8000/logout', {});
    localStorage.clear();
    this.router.navigate(['login']);
    this.username = null;
  }
}
