import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrls: [
    "./register-page.component.css",
    "../../css/button.css",
    "../../css/menu-error.css"
  ]
})
export class RegisterPageComponent implements OnInit {
  link: string;
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.link = this.router.url;
  }
  onRegisterSubmit() {
    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    const errorLabel: HTMLElement = document.querySelector(
      ".menu__error"
    ) as HTMLElement;
  }
}
