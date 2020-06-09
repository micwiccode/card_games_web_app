import { Component, OnInit } from "@angular/core";
import { Card } from "../../Card";
import { Turn } from "../../turn";
import { Action } from "../../Action";
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
  currentTableCard: Card;
  isPossibleMoveFlag: boolean = true;
  selectedCardsAliasList: string[] = [];
  currentAction: Action = null;
  isTableCardTaken: boolean = false;

  constructor(private panGameService: PanGameService) {}

  ngOnInit(): void {
    this.panGameService.playerDeck$.subscribe(deck => {
      this.cards = deck.cards;
      this.userName = deck.userName;
      this.isUserTurn = deck.isUserTurn;
    });
    this.panGameService.turn$.subscribe(turn => {
      this.turn = turn;
    });
    this.panGameService.currentTableCard$.subscribe(
      card => (this.currentTableCard = card)
    );
    this.panGameService.isPossibleMoveFlag$.subscribe(
      isPossibleMoveFlag => (this.isPossibleMoveFlag = isPossibleMoveFlag)
    );
    this.panGameService.currentAction$.subscribe(
      currentAction => (this.currentAction = currentAction)
    );
    this.panGameService.isTableCardTaken$.subscribe(
      isTableCardTaken => (this.isTableCardTaken = isTableCardTaken)
    );
  }

  chooseCard(cardAlias: string, event: any) {
    const cardAliasIndex = this.selectedCardsAliasList.indexOf(cardAlias);
    if (cardAliasIndex === -1) {
      if (
        this.panGameService.isCardValid(
          cardAlias,
          this.selectedCardsAliasList[this.selectedCardsAliasList.length - 1],
          this.currentAction
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

  nextPlayer() {
    this.panGameService.nextPlayer();
  }

  makeAction() {
    if (this.currentAction.type === "Draw") {
      this.panGameService.drawCards(parseInt(this.currentAction.content));
    } else if (
      this.currentAction.type === "Stop" ||
      this.currentAction.type === "Request" ||
      this.currentAction.type === "Color change"
    ) {
    } else {
      this.panGameService.nextPlayer();
    }
    this.panGameService.makeActionDone();
  }

  playCards() {
  }
}
