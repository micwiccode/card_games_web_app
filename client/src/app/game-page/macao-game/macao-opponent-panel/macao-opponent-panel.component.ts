import { Component, OnInit, Input } from "@angular/core";
import { Deck } from "../../Deck";
import {MacaoGameService} from "../../../services/macao-game.service";

@Component({
  selector: "app-macao-opponent-panel",
  templateUrl: "./macao-opponent-panel.component.html",
  styleUrls: [
    "./macao-opponent-panel.component.css",
    "../../card-image.css",
    "../../deck.css",
    "../../arrow.css"
  ]
})
export class MacaoOpponentPanelComponent implements OnInit {
  @Input("vertical") isVertical: boolean = false;
  @Input() deckPosition: number;
  opponentDeck: Deck;

  gridStyle() {
    if (this.opponentDeck) {
      return this.isVertical
        ? {
            "grid-template-rows": `repeat(${this.opponentDeck.numberOfCards -
              1}, 16px) 120px`
          }
        : {
            "grid-template-columns": `repeat(${this.opponentDeck.numberOfCards -
              1}, 16px) 120px`
          };
    }
  }

  flexStyle() {
    return !this.isVertical
      ? { display: `flex`, "flex-direction": "column", "align-items": "center" }
      : this.deckPosition === 1
      ? { display: `flex` }
      : { display: `flex`, "flex-direction": "row-reverse" };
  }

  cardStyle(i: number) {
    return this.isVertical
      ? { "grid-row": +(i + 1), "z-index": +i }
      : { "grid-column": +(i + 1), "z-index": +i };
  }

  arrowStyle() {
    if (this.opponentDeck.isUserTurn) {
      if (this.deckPosition === 1) return { transform: "rotate(-90deg)" };
      else if (this.deckPosition === 2) return { transform: "rotate(90deg)" };
    } else return { display: "none" };
  }

  constructor(private macaoGameService: MacaoGameService) {}

  ngOnInit(): void {
    this.macaoGameService.opponentsDecks$.subscribe(opponentsDecks => {
      this.opponentDeck = opponentsDecks[this.deckPosition];
      this.gridStyle();
    });
  }
}
