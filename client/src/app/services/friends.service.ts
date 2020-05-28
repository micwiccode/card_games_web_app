import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  });
  constructor(private http: HttpClient) {}

  getFriends() {
    return this.http.get(`${environment.API_URL}/friendList`).pipe();
  }

  addFriend(friend) {
    return this.http
      .post(`${environment.API_URL}/addFriend`, friend, { headers: this.header })
      .pipe();
  }

  deleteFriend(friend) {
    return this.http
      .post(`${environment.API_URL}/removeFriend`, friend, {
        headers: this.header,
      })
      .pipe();
  }

  getFriendRequest() {
    return this.http
      .get(`${environment.API_URL}/friendRequestList`, { headers: this.header })
      .pipe();
  }

  acceptFriendRequest(friend) {
    return this.http
      .post(`${environment.API_URL}/acceptFriendRequest`, friend, {
        headers: this.header,
      })
      .pipe();
  }

  sendFriendRequest(friend) {
    return this.http
      .post(`${environment.API_URL}/sendFriendRequest`, friend, {
        headers: this.header,
      })
      .pipe();
  }

  rejectFriendRequest(friend) {
    return this.http
      .post(`${environment.API_URL}/rejectFriendRequest`, friend, {
        headers: this.header,
      })
      .pipe();
  }
}
