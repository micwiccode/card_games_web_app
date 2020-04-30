import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-log-in-page",
  templateUrl: "./log-in-page.component.html",
  styleUrls: [
    "./log-in-page.component.css",
    "../../css/button.css",
    "../../css/menu-error.css"
  ]
})
export class LogInPageComponent implements OnInit {
  username: string;
  password: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
  }
}
