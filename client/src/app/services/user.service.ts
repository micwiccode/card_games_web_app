import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUser(token = undefined) {
    if (token !== undefined) {
      return this.http
        .get(`${environment.API_URL}/getUser`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        .pipe();
    } else {
      return this.http
        .get(`${environment.API_URL}/getUser`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .pipe();
    }
  }

  updateUser(user) {
    return this.http
      .put(`${environment.API_URL}/updateUser`, user, { headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        } })
      .pipe();
  }
}
