import { Component, OnInit } from "@angular/core";
import { RoomsService } from "../../services/rooms.service";
import { GameService } from "../../services/game.service";

@Component({
  selector: "app-score-board",
  templateUrl: "./score-board.component.html",
  styleUrls: ["./score-board.component.css"]
})
export class ScoreBoardComponent implements OnInit {

  constructor(
    private roomsService: RoomsService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {}

  exitGame() {
    this.roomsService.exitRoom().subscribe();
    this.gameService.closeServerSendEvents();
  }
}
