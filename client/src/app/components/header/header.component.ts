import {Component, OnInit, DoCheck, Input} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, DoCheck {
  @Input() isLogged: boolean;
  link: string;

  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    this.link = this.router.url;
  }

  onLogOutClick() {
    this.authService.logOut();
  }
}
