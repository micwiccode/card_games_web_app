import { Component, OnInit } from "@angular/core";
import { GameService } from "../services/game.service";
import { UserService } from "../services/user.service";
import { RoomsService } from "../services/rooms.service";
import { environment } from "../../environments/environment";
import { Deck } from "./deck";
import { Card } from "./card";

@Component({
  selector: "app-game-page",
  templateUrl: "./game-page.component.html",
  styleUrls: ["./game-page.component.css", "../../css/button.css"]
})
export class GamePageComponent implements OnInit {
  waitingForStart = true;
  playersListQueue = [];
  isGameAdmin = null;
  roomID = null;
  userName = null;
  userID = null;

  constructor(
    private gameService: GameService,
    private roomsService: RoomsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.roomID = localStorage.getItem("roomID");
    this.userName = localStorage.getItem("username");
    let adminID;
    this.roomsService.getRoomData(this.roomID).subscribe(data => {
      // @ts-ignore
      this.playersListQueue = data.data.usersInRoom.users;
      // @ts-ignore
      adminID = data.data.adminId;
      this.userService.getUser().subscribe(data => {
        // @ts-ignore
        this.userID = data.data.id;
        this.isGameAdmin = adminID === this.userID;
      });
    });
    this.initWebSocketRoom();
    this.initWebSocketGame();
  }
  initWebSocketGame() {
    this.gameService.getServerSendEvent(
      `${environment.MERCURE_URL}/.well-known/mercure?topic=gameInfo/${this.roomID}`
    )
      .subscribe(data => {
        // @ts-ignore
        const incomingData = JSON.parse(data.data);
        console.log('game');
        console.log(incomingData);
        if (incomingData.start !== undefined) {
          this.closeSpinner()
          this.gameService.initGame(incomingData, this.userID)
        }
        if (incomingData.play !== undefined){
          this.gameService.initRound(incomingData)
        }
        if (incomingData.draw !== undefined){
          this.gameService.iniDraw(incomingData)
        }
        if (incomingData.next !== undefined){
          this.gameService.initNextPlayer(incomingData)
        }
      });
  }

  initWebSocketRoom() {
    this.gameService
      .getServerSendEvent(
        `${environment.MERCURE_URL}/.well-known/mercure?topic=roomInfo/${this.roomID}`
      )
      .subscribe(data => {
        // @ts-ignore
        const incomingData = JSON.parse(data.data);
        console.log('room');
        console.log(incomingData);
        if (this.isGameAdmin === false && this.waitingForStart === true) {
          if (incomingData.start !== undefined) {
            this.waitingForStart = false;
          }
        }
        if (incomingData.users !== undefined) {
          this.playersListQueue = incomingData.users;
        }
      });
  }

  startGame() {
    this.gameService.startGame().subscribe(data => {
      // @ts-ignore
      if (data.data === true) this.closeSpinner();
    });
  }

  closeSpinner(){
    this.waitingForStart = false
  }
}
