import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { ValidateService } from "../services/validate.service";

@Component({
  selector: "app-my-profile-page",
  templateUrl: "./my-profile-page.component.html",
  styleUrls: [
    "./my-profile-page.component.css",
    "../../css/button.css",
    "../../css/menu-error.css"
  ]
})
export class MyProfilePageComponent implements OnInit {
  isLoading = true;
  username: "";
  email = "";
  passwordOld = null;
  passwordNew = null;
  passwordNewRepeat = null;
  disableEmail = true;
  disablePassword = true;

  constructor(
    private userService: UserService,
    private validateService: ValidateService
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(data => {
      // @ts-ignore
      this.username = data.data.username;
      // @ts-ignore
      this.email = data.data.email;
      this.isLoading = false;
    });
  }

  changeEmail() {
    this.disableEmail = !this.disableEmail;
  }

  changePassword() {
    this.disablePassword = !this.disablePassword;
  }

  onUserSubmit() {
    const userUpdateData = {
      email: this.email,
      passwordOld: this.passwordOld === undefined ? null : this.passwordOld,
      passwordNew: this.passwordNew
    };
    const errorLabel: HTMLElement = document.querySelector(
      ".menu__error"
    ) as HTMLElement;

    const validateResponse = this.validateService.validateUserUpdate(
      userUpdateData,
      this.passwordNewRepeat
    );

    if (validateResponse.isValid) {
      this.userService.updateUser(userUpdateData).subscribe(data => {
        // @ts-ignore
        if (data.data === true) {
          errorLabel.style.backgroundColor = "green";
          errorLabel.style.display = "block";
          errorLabel.textContent = "Zaktualizowano dane";
        } else {
          errorLabel.style.display = "block";
          // @ts-ignore
          errorLabel.textContent = data.error;
        }
      });
    } else {
      errorLabel.style.display = "block";
      errorLabel.textContent = validateResponse.msg;
    }
  }
}
