import { Component, OnInit } from "@angular/core";
import { Card } from "../../Card";
import {PanGameService} from "../../../services/pan-game.service";

@Component({
  selector: "app-pan-card-table",
  templateUrl: "./pan-card-table.component.html",
  styleUrls: ["./pan-card-table.component.css", "../../card-image.css"]
})
export class PanCardTableComponent implements OnInit {
  currentTopCards: Card[] = [];

  constructor(private panGameService: PanGameService) {}

  ngOnInit(): void {
    this.panGameService.currentTopCards$.subscribe(
      cards => (this.currentTopCards = cards)
    );
  }

  drawCards() {
    this.panGameService.drawCards();
  }

  rowStyle() {
    if (this.moreThanThreeCardsOnTable()) {
      return {
        'grid-template-columns':
          '3px 16px 16px 16px 120px'
      }
    }
    else {
      return {
        'grid-template-columns':
          'repeat(' + (this.currentTopCards.length - 1) + ', 16px) 120px'
      }
    }
  }

  imageStyle(i: number) {
    if(this.moreThanThreeCardsOnTable()) {
      return { 'grid-column': (i + 2), 'z-index': i + 1 }
    }
    else {
      return { 'grid-column': (i + 1), 'z-index': i }
    }
  }

  moreThanThreeCardsOnTable() {
    return this.currentTopCards.length != 0 && this.currentTopCards[0].value !== '9H';
  }
}
