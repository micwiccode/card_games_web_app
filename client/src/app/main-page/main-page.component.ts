import { Component, DoCheck, Input } from "@angular/core";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["../../css/button.css", "./main-page.component.css"]
})
export class MainPageComponent implements DoCheck {
  @Input() isLogged: boolean = false;

  ngDoCheck(): void {
    this.isLogged = localStorage.getItem("username") !== null;
  }
}
