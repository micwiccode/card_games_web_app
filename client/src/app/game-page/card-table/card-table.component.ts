import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { Card } from "../Card";

@Component({
  selector: "app-card-table",
  templateUrl: "./card-table.component.html",
  styleUrls: ["./card-table.component.css", "../card-image.css"]
})
export class CardTableComponent implements OnInit {
  currentTableCard: Card;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.currentTableCard$.subscribe(
      card => (this.currentTableCard = card)
    );
  }

  drawCards() {
    this.gameService.setTableCardAsTaken();
    this.gameService.drawCards(1);
  }
}
