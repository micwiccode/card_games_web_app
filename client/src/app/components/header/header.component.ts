import { Component, OnInit, DoCheck, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, DoCheck {
  @Input() isLogged: boolean = false;
  link: string;
  isSideMenuActive: boolean = false;

  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    if (this.link !== this.router.url) this.isSideMenuActive = false;
    this.link = this.router.url;
  }

  onLogOutClick() {
    this.authService.logOut();
  }

  toggleSideMenu() {
    this.isSideMenuActive = !this.isSideMenuActive;
  }
}
