import { Component, OnInit, Input } from "@angular/core";
import { GameService } from "../../services/game.service";
import { Deck } from "../Deck";

@Component({
  selector: "app-opponent-panel",
  templateUrl: "./opponent-panel.component.html",
  styleUrls: [
    "./opponent-panel.component.css",
    "../card-image.css",
    "../deck.css",
    "../arrow.css"
  ]
})
export class OpponentPanelComponent implements OnInit {
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

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.opponentsDecks$.subscribe(opponentsDecks => {
      this.opponentDeck = opponentsDecks[this.deckPosition];
      this.gridStyle();
    });
  }
}

/*
import { Component, OnInit, Input } from "@angular/core";
import { Deck } from "../deck";
import { GameService } from "../../services/game.service";

@Component({
  selector: "app-opponent-panel",
  templateUrl: "./opponent-panel.component.html",
  styleUrls: [
    "./opponent-panel.component.css",
    "../card-image.css",
    "../deck.css",
    "../arrow.css"
  ]
})
export class OpponentPanelComponent implements OnInit {
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

  cardStyle(i: number) {
    return this.isVertical
      ? { "grid-row": +(i + 1), "z-index": +i }
      : { "grid-column": +(i + 1), "z-index": +i };
  }

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.opponentsDecks$.subscribe(opponentsDecks => {
      this.opponentDeck = opponentsDecks[this.deckPosition];
      this.gridStyle();
    });
  }
}
 */
