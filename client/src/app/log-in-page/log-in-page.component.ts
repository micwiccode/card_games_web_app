import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ValidateService } from "../services/validate.service";
import { AuthService } from "../services/auth.service";

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
  link: string;
  username: string;
  password: string;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.link = this.router.url;
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    // @ts-ignore
    const errorLabel: HTMLElement = document.querySelector(
      ".menu__error"
    ) as HTMLElement;

    const validateResponse = this.validateService.validateLogin(user);

    if (validateResponse.isValid) {
      this.authService.logIn(user).subscribe(data => {
        const result = data.toString();
        if (result === "true") {
          this.authService.storeUserData(this.username);
          this.router.navigate(["/"]);
        } else {
          errorLabel.style.display = "block";
          errorLabel.textContent = result;
        }
      });
    } else {
      errorLabel.style.display = "block";
      errorLabel.textContent = validateResponse.msg;
    }
  }
}
