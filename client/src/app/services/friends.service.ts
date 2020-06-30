import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FriendsService {
  constructor(private http: HttpClient) {}

  getFriends() {
    return this.http.get(`${environment.API_URL}/friendList`, { headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("token")).tokenValue
        }`
      } }).pipe();
  }

  deleteFriend(friend) {
    return this.http
      .post(`${environment.API_URL}/removeFriend`, friend, {
        headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("token")).tokenValue
    }`
  }
      })
      .pipe();
  }

  getFriendRequest() {
    return this.http
      .get(`${environment.API_URL}/friendRequestList`, { headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("token")).tokenValue
    }`
  } })
      .pipe();
  }

  acceptFriendRequest(friend) {
    return this.http
      .post(`${environment.API_URL}/acceptFriendRequest`, friend, {
        headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("token")).tokenValue
    }`
  }
      })
      .pipe();
  }

  sendFriendRequest(friend) {
    return this.http
      .post(`${environment.API_URL}/sendFriendRequest`, friend, {
        headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("token")).tokenValue
    }`
  }
      })
      .pipe();
  }

  rejectFriendRequest(friend) {
    return this.http
      .post(`${environment.API_URL}/rejectFriendRequest`, friend, {
        headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("token")).tokenValue
    }`
  }
      })
      .pipe();
  }
}
