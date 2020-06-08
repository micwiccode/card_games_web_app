import { Component, DoCheck, Input } from "@angular/core";
import {AuthService} from "../services/auth.service";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["../../css/button.css", "./main-page.component.css"]
})
export class MainPageComponent implements DoCheck {
  @Input() isLogged: boolean = false;

  constructor(private authService: AuthService) {}

  ngDoCheck(): void {
    this.isLogged = this.authService.checkIsLogged();
  }
}
