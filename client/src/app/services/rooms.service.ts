import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class RoomsService {
  constructor(private http: HttpClient, private router: Router) {}

  getAllRooms() {
    return this.http
      .get(`${environment.API_URL}/roomList`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .pipe();
  }

  createRoom(room) {
    return this.http
      .post(`${environment.API_URL}/createRoom`, room, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .pipe();
  }

  enterRoom(room) {
    return this.http
      .post(`${environment.API_URL}/enterRoom`, room, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .pipe();
  }

  getRoomData(roomId) {
    return this.http
      .get(`${environment.API_URL}/room/${roomId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .pipe();
  }

  exitRoom() {
    this.router.navigate(["/"]);
    return this.http
      .post(
        `${environment.API_URL}/exitRoom`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .pipe();
  }
}
