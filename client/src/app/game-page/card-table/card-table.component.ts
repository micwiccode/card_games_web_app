import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Card } from '../card';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.css', '../card-image.css']
})
export class CardTableComponent implements OnInit {
  lastPlayedCard: Card;
  currentlyDisplayedArrowClass: string = 'arrow__right';

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.lastPlayedCard$.subscribe(
      card => this.lastPlayedCard = card
    )
  }

  drawCard() {
    this.gameService.drawCard();
  }

}
