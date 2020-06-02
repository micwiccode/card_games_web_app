import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { Card } from "../Card";
import { Turn } from "../turn";
import { Action } from "../Action";

@Component({
  selector: "app-player-panel",
  templateUrl: "./player-panel.component.html",
  styleUrls: [
    "../../../css/button.css",
    "./player-panel.component.css",
    "../deck.css",
    "../card-image.css",
    "../arrow.css"
  ]
})
export class PlayerPanelComponent implements OnInit {
  cards: Card[] = [];
  userName: string = null;
  isUserTurn: boolean = false;
  turn: Turn;
  currentTableCard: Card;
  isPossibleMoveFlag: boolean = true;
  selectedCardsAliasList: string[] = [];
  currentAction: Action = null;
  isTableCardTaken: boolean = false;
  isQuestion: any = null;

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

  playCards() {
    if (this.selectedCardsAliasList.length > 0) {
      if(this.selectedCardsAliasList[this.selectedCardsAliasList.length-1][0] === 'J'){
        this.isQuestion = 'J'
      }
      else if(this.selectedCardsAliasList[this.selectedCardsAliasList.length-1][0] === 'A')
      {
        this.isQuestion = 'A'
      }
      else this.gameService.playCards(this.selectedCardsAliasList);
    }
  }

  answerQuestion(){

  }
}
