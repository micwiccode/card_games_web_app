import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ValidateService } from "../services/validate.service";
import { AuthService } from "../services/auth.service";

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

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router
  ) {}

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

    const validateResponse = this.validateService.validateRegister(
      newUser,
      this.passwordRepeat
    );

    if (validateResponse.isValid) {
      this.authService.register(newUser).subscribe(data => {
        console.log(data)
        // @ts-ignore
        const token = data.token;
        if (token) {
          this.authService.auth(token);
        } else {
          errorLabel.style.display = 'block';
          // @ts-ignore
          errorLabel.textContent = data.error;
        }
      });
    } else {
      errorLabel.style.display = 'block';
      errorLabel.textContent = validateResponse.msg;
    }
  }
}
