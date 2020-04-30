import { Component, OnInit, DoCheck } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, DoCheck {
  link: string;
  constructor(public router: Router) {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    this.link = this.router.url;
  }
}
