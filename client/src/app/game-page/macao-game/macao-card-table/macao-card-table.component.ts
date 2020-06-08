import { Component, OnInit } from "@angular/core";
import { GameService } from "../../../services/game.service";
import { Card } from "../../Card";

@Component({
  selector: "app-card-table",
  templateUrl: "./makao-card-table.component.html",
  styleUrls: ["./makao-card-table.component.css", "../../card-image.css"]
})
export class MakaoCardTableComponent implements OnInit {
  currentTableCard: Card;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.currentTableCard$.subscribe(
      card => (this.currentTableCard = card)
    );
  }

  drawCards() {
    this.gameService.drawCards(1);
  }
}
