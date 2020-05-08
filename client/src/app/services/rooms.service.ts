import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class RoomsService {
  header = new HttpHeaders({
    "Content-Type": "application/json"
  });
  constructor(private http: HttpClient, private router: Router) {}

  getAllRooms() {
    return this.http.get("/roomList", { headers: this.header }).pipe();
  }

  createRoom(room) {
    return this.http.post("/createRoom", room, { headers: this.header }).pipe();
  }

  enterRoom(room) {
    return this.http.post("/enterRoom", room, { headers: this.header }).pipe();
  }

  getRoomData(roomId) {
    return this.http.get(`/room/${roomId}`, { headers: this.header }).pipe();
  }

  exitRoom() {
    this.router.navigate(["/"]);
    return this.http.post("/exitRoom", {}, { headers: this.header }).pipe();
  }
}
