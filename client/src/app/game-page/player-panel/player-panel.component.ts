import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { Card } from "../card";
import {Turn} from "../turn";

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
  selectedCardsList: Card[];

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
  }

  playCard(card: Card) {
    //   this.gameService.playCard(card);
  }
}
