import { Component, OnInit, Input } from "@angular/core";
import { Deck } from "../../Deck";
import { PanGameService } from "../../../services/pan-game.service";

@Component({
  selector: "app-pan-opponent-panel",
  templateUrl: "./pan-opponent-panel.component.html",
  styleUrls: [
    "./pan-opponent-panel.component.css",
    "../../card-image.css",
    "../../deck.css",
    "../../arrow.css"
  ]
})
export class PanOpponentPanelComponent implements OnInit {
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

  constructor(private panGameService: PanGameService) {}

  ngOnInit(): void {
    this.panGameService.opponentsDecks$.subscribe(opponentsDecks => {
      this.opponentDeck = opponentsDecks[this.deckPosition];
      this.gridStyle();
    });
  }
}
