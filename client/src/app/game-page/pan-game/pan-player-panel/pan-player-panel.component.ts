import { Component, OnInit } from "@angular/core";
import { Card } from "../../Card";
import { Turn } from "../../turn";
import { PanGameService } from "../../../services/pan-game.service";

@Component({
  selector: "app-pan-player-panel",
  templateUrl: "./pan-player-panel.component.html",
  styleUrls: [
    "../../../../css/button.css",
    "./pan-player-panel.component.css",
    "../../deck.css",
    "../../card-image.css",
    "../../arrow.css"
  ]
})
export class PanPlayerPanelComponent implements OnInit {
  cards: Card[] = [];
  userName: string = null;
  isUserTurn: boolean = false;
  turn: Turn;
  currentTopCards: Card[];
  errorMessage: string = "";
  isPossibleMoveFlag: boolean = true;
  selectedCardsAliasList: string[] = [];

  constructor(private panGameService: PanGameService) {}

  ngOnInit(): void {
    this.panGameService.playerDeck$.subscribe(deck => {
      this.cards = deck.cards;
      this.userName = deck.userName;
      this.isUserTurn = deck.isUserTurn;
    });
    this.panGameService.currentTopCards$.subscribe(cards => {
      this.currentTopCards = cards;
    });
    this.panGameService.turn$.subscribe(turn => {
      this.turn = turn;
    });
    this.panGameService.isPossibleMoveFlag$.subscribe(
      isPossibleMoveFlag => (this.isPossibleMoveFlag = isPossibleMoveFlag)
    );
  }

  chooseCard(cardAlias: string, event: any) {
    if (this.isUserTurn) {
      const cardAliasIndex = this.selectedCardsAliasList.indexOf(cardAlias);
      if (cardAliasIndex === -1) {
        if (
          this.panGameService.isCardValid(
            cardAlias,
            this.selectedCardsAliasList
          )
        ) {
          event.target.classList.add("card__image--selected");
          this.selectedCardsAliasList.push(cardAlias);
        }
      } else {
        event.target.classList.remove("card__image--selected");
        this.selectedCardsAliasList.splice(cardAliasIndex, 1);
      }
    }
  }

  drawCards() {
    this.errorMessage = "";
    this.panGameService.drawCards();
  }

  playCards() {
    if (this.isUserTurn) {
      if (this.selectedCardsAliasList.length === 0) {
        this.errorMessage = "Wskaż karty do zagrania";
      }
      else if (
        this.selectedCardsAliasList.length === 1 ||
        (this.selectedCardsAliasList.length === 3 &&
          this.currentTopCards.length === 1 &&
          this.currentTopCards[0].value == "9H") ||
        this.selectedCardsAliasList.length === 4
      ) {
        this.panGameService.playCards(this.selectedCardsAliasList);
        this.selectedCardsAliasList = [];
        this.errorMessage = "";
      } else {
        this.errorMessage = "Zły ruch. zagraj 1 lub 4 karty danej figury";
      }
    }
  }
}
