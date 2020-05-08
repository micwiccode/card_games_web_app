import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  header = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getFriends() {
    return this.http.get('/friendList').pipe();
  }

  addFriend(friend) {
    return this.http
      .post('/addFriend', friend, { headers: this.header })
      .pipe();
  }

  deleteFriend(friend) {
    return this.http
      .post('/removeFriend', friend, {
        headers: this.header,
      })
      .pipe();
  }

  getFriendRequest() {
    return this.http
      .get('/friendRequestList', { headers: this.header })
      .pipe();
  }

  acceptFriendRequest(friend) {
    return this.http
      .post('/acceptFriendRequest', friend, {
        headers: this.header,
      })
      .pipe();
  }

  sendFriendRequest(friend) {
    return this.http
      .post('/sendFriendRequest', friend, {
        headers: this.header,
      })
      .pipe();
  }

  rejectFriendRequest(friend) {
    return this.http
      .post('/rejectFriendRequest', friend, {
        headers: this.header,
      })
      .pipe();
  }
}
