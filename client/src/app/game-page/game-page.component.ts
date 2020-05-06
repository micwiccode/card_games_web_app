import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css', '../../css/button.css']
})
export class GamePageComponent implements OnInit {
  gameStarted = false;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.newGame().subscribe(
      response => this.gameStarted = response
    )
  }
  
}
