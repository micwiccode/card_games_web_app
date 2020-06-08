import { Component, OnInit } from "@angular/core";
import { Card } from "../../Card";
import {PanGameService} from "../../../services/pan-game.service";

@Component({
  selector: "app-pan-card-table",
  templateUrl: "./pan-card-table.component.html",
  styleUrls: ["./pan-card-table.component.css", "../../card-image.css"]
})
export class PanCardTableComponent implements OnInit {
  currentTableCard: Card;

  constructor(private panGameService: PanGameService) {}

  ngOnInit(): void {
    this.panGameService.currentTableCard$.subscribe(
      card => (this.currentTableCard = card)
    );
  }

  drawCards() {
    this.panGameService.drawCards(1);
  }
}
