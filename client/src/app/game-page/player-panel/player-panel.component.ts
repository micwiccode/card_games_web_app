import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Card } from '../card';

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrls: ['../../../css/button.css', './player-panel.component.css', '../card-image.css']
})
export class PlayerPanelComponent implements OnInit {
  gameStarted: boolean;
  cards: Card[];
  selectedCard: Card;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.playerCards$.subscribe(cards =>{
      this.cards = cards;
      console.log(cards);
    });
  }

  playCard(card: Card) {
    this.gameService.playCard(card);
  }
  
}
