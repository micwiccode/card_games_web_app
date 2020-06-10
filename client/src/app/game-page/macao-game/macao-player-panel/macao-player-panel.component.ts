import { Component, OnInit } from "@angular/core";
import { Card } from "../../Card";
import { Turn } from "../../turn";
import { Action } from "../../Action";
import {MacaoGameService} from "../../../services/macao-game.service";

@Component({
  selector: "app-macao-player-panel",
  templateUrl: "./macao-player-panel.component.html",
  styleUrls: [
    "../../../../css/button.css",
    "./macao-player-panel.component.css",
    "../../deck.css",
    "../../card-image.css",
    "../../arrow.css"
  ]
})
export class MacaoPlayerPanelComponent implements OnInit {
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

  constructor(private macaoGameService: MacaoGameService) {}

  ngOnInit(): void {
    this.macaoGameService.playerDeck$.subscribe(deck => {
      this.cards = deck.cards;
      this.userName = deck.userName;
      this.isUserTurn = deck.isUserTurn;
    });
    this.macaoGameService.turn$.subscribe(turn => {
      this.turn = turn;
    });
    this.macaoGameService.currentTableCard$.subscribe(
      card => (this.currentTableCard = card)
    );
    this.macaoGameService.isPossibleMoveFlag$.subscribe(
      isPossibleMoveFlag => (this.isPossibleMoveFlag = isPossibleMoveFlag)
    );
    this.macaoGameService.currentAction$.subscribe(
      currentAction => (this.currentAction = currentAction)
    );
    this.macaoGameService.isTableCardTaken$.subscribe(
      isTableCardTaken => (this.isTableCardTaken = isTableCardTaken)
    );
    console.log(this.currentAction)
  }

  chooseCard(cardAlias: string, event: any) {
    const cardAliasIndex = this.selectedCardsAliasList.indexOf(cardAlias);
    if (cardAliasIndex === -1) {
      if (
        this.macaoGameService.isCardValid(
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
    this.macaoGameService.nextPlayer();
  }

  makeAction() {
    console.log("akcja: " + this.currentAction.type);
    console.log("akcja: " + this.currentAction.content);
    if (this.currentAction.type === "Draw" || this.currentAction.type === "Draw previous") {
      this.macaoGameService.drawCards(parseInt(this.currentAction.content));
    } else if (
      this.currentAction.type === "Stop" ||
      this.currentAction.type === "Request" ||
      this.currentAction.type === "Color change"
    ) {
    }
    this.macaoGameService.makeActionDone();
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
        this.macaoGameService.playCards(this.selectedCardsAliasList, null);
        this.selectedCardsAliasList = [];
      }
    }
  }

  getDemandAnswer(demandValue: string) {
    this.isDemand = false;
    this.demandVersion = null;
    this.macaoGameService.playCards(this.selectedCardsAliasList, demandValue);
  }
}
