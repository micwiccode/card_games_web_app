import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: [
    './my-profile-page.component.css',
    '../../css/button.css',
  ],
})

export class MyProfilePageComponent implements OnInit {
  username: '';
  email: '';
  passwordOld: null;
  passwordNew: null;
  passwordNewRepeat: null;
  disableEmail = true;
  disablePassword = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
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
      passwordOld: this.passwordOld,
      passwordNew: this.passwordNew,
    };
  }
}
