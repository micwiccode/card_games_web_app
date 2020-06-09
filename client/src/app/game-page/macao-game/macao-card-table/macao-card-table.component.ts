import { Component, OnInit } from "@angular/core";
import { Card } from "../../Card";
import {MacaoGameService} from "../../../services/macao-game.service";

@Component({
  selector: "app-macao-card-table",
  templateUrl: "./macao-card-table.component.html",
  styleUrls: ["./macao-card-table.component.css", "../../card-image.css"]
})
export class MacaoCardTableComponent implements OnInit {
  currentTableCard: Card;

  constructor(private macaoGameService: MacaoGameService) {}

  ngOnInit(): void {
    this.macaoGameService.currentTableCard$.subscribe(
      card => (this.currentTableCard = card)
    );
  }

  drawCards() {
    this.macaoGameService.drawCards(1);
  }
}
