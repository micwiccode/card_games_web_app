import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  username = null;
  header = new HttpHeaders({
    "Content-Type": "application/json"
  });
  TTL: number = 7200000;
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  register(user) {
    return this.http
      .post(`${environment.API_URL}/register`, user, { headers: this.header })
      .pipe();
  }

  logIn(user) {
    return this.http
      .post(`${environment.API_URL}/login`, user, { headers: this.header })
      .pipe();
  }

  auth(token) {
    this.storeToken(token, () => {
      this.getUser(token);
    });
  }

  storeToken(token, callback) {
    const tokenObj = {tokenValue: token, expiryTime: new Date().getTime() + this.TTL}
    localStorage.setItem('token', JSON.stringify(tokenObj));
    callback();
  }

  checkIsLogged(){
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      return false;
    }
    const token = JSON.parse(tokenString)
    const nowTime = new Date()
    if (nowTime.getTime() > token.expiryTime) {
      localStorage.removeItem('token')
      return false
    }
    return true;
  }

  storeUserData(username) {
    localStorage.setItem("username", username);
    this.username = username;
  }

  logOut() {
    this.router.navigate(["login"]);
    this.username = null;
    this.http
      .post(
        `${environment.API_URL}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).tokenValue}`
          }
        }
      )
      .subscribe();
    localStorage.clear();
  }

  getUser(token) {
    this.userService.getUser(token).subscribe(data => {
      // @ts-ignore
      const username = data.data.username;
      this.storeUserData(username);
      this.router.navigate(["/"]);
    });
  }
}
