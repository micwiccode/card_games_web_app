import { Component, OnInit } from "@angular/core";
import { GameService } from "../../../services/game.service";
import { Card } from "../../Card";
import { Turn } from "../../turn";
import { Action } from "../../Action";

@Component({
  selector: "app-player-panel",
  templateUrl: "./makao-player-panel.component.html",
  styleUrls: [
    "../../../../css/button.css",
    "./makao-player-panel.component.css",
    "../deck.css",
    "../card-image.css",
    "../arrow.css"
  ]
})
export class MakaoPlayerPanelComponent implements OnInit {
  cards: Card[] = [];
  userName: string = null;
  isUserTurn: boolean = false;
  turn: Turn;
  currentTableCard: Card;
  isPossibleMoveFlag: boolean = true;
  selectedCardsAliasList: string[] = [];
  currentAction: Action = null;
  isTableCardTaken: boolean = false;
  isDemand: boolean = false;
  demandVersion: string = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.playerDeck$.subscribe(deck => {
      this.cards = deck.cards;
      this.userName = deck.userName;
      this.isUserTurn = deck.isUserTurn;
    });
    this.gameService.turn$.subscribe(turn => {
      this.turn = turn;
    });
    this.gameService.currentTableCard$.subscribe(
      card => (this.currentTableCard = card)
    );
    this.gameService.isPossibleMoveFlag$.subscribe(
      isPossibleMoveFlag => (this.isPossibleMoveFlag = isPossibleMoveFlag)
    );
    this.gameService.currentAction$.subscribe(
      currentAction => (this.currentAction = currentAction)
    );
    this.gameService.isTableCardTaken$.subscribe(
      isTableCardTaken => (this.isTableCardTaken = isTableCardTaken)
    );
  }

  chooseCard(cardAlias: string, event: any) {
    const cardAliasIndex = this.selectedCardsAliasList.indexOf(cardAlias);
    if (cardAliasIndex === -1) {
      if (
        this.gameService.isCardValid(
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

  nextPlayer(){
    this.gameService.nextPlayer();
  }

  makeAction() {
    console.log("akcja: " + this.currentAction.type);
    console.log("akcja: " + this.currentAction.content);
    if (this.currentAction.type === "Draw") {
      this.gameService.drawCards(parseInt(this.currentAction.content));
    } else if (
      this.currentAction.type === "Stop" ||
      this.currentAction.type === "Request" ||
      this.currentAction.type === "Color change"
    ) {
    }
    else{
      this.gameService.nextPlayer();
    }
    this.gameService.makeActionDone();
  }

  playCards() {
    if (this.selectedCardsAliasList.length > 0) {
      if (
        this.selectedCardsAliasList[
          this.selectedCardsAliasList.length - 1
        ][0] === "J"
      ) {
        this.demandVersion = "J";
        this.isDemand = true;
      } else if (
        this.selectedCardsAliasList[
          this.selectedCardsAliasList.length - 1
        ][0] === "A"
      ) {
        this.demandVersion = "A";
        this.isDemand = true;
      } else {
        this.gameService.playCards(this.selectedCardsAliasList, null);
        this.selectedCardsAliasList = [];
      }
    }
  }

  getDemandAnswer(demandValue: string) {
    this.isDemand = false;
    this.demandVersion = null;
    this.gameService.playCards(this.selectedCardsAliasList, demandValue);
  }
}
