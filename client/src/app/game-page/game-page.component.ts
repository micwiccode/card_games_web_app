import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { RoomsService } from "../services/rooms.service";
import { environment } from "../../environments/environment";
import {MacaoGameService} from "../services/macao-game.service";
import {PanGameService} from "../services/pan-game.service";

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
  isEnd = false;
  gameType = 'Macao';
  gameService;

  constructor(
    private macaoGameService: MacaoGameService,
    private panGameService: PanGameService,
    private roomsService: RoomsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.gameService = this.gameType === 'Macao' ?  this.macaoGameService : this.panGameService;
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
    this.gameService.isEnd$.subscribe(isEnd => (this.isEnd = isEnd));
  }

  initWebSocketGame() {
    this.gameService
      .getServerSendEvent(
        `${environment.MERCURE_URL}/.well-known/mercure?topic=gameInfoCards/${this.roomID}`
      )
      .subscribe(data => {
        // @ts-ignore
        const incomingData = JSON.parse(data.data);
        console.log("game");
        console.log(incomingData);
        if (incomingData.start !== undefined) {
          this.gameService.initStart();
          this.gameService.initGame(incomingData.start, this.userID);
          this.closeSpinner();
        }
        if (incomingData.play !== undefined) {
          this.gameService.initRound(incomingData.play);
        }
        if (incomingData.draw !== undefined) {
          this.gameService.initDraw(incomingData.draw);
        }
        if (incomingData.next !== undefined) {
          this.gameService.initNextPlayer(incomingData.next);
        }
      });
  }

  initWebSocketRoom() {
    this.gameService
      .getServerSendEvent(
        `${environment.MERCURE_URL}/.well-known/mercure?topic=roomInfoCards/${this.roomID}`
      )
      .subscribe(data => {
        // @ts-ignore
        const incomingData = JSON.parse(data.data);
        console.log("room");
        console.log(incomingData);
        if (this.isGameAdmin === false && this.waitingForStart === true) {
          if (incomingData.start !== undefined) {
            this.waitingForStart = false;
            this.gameService.initStart();
          }
        }
        if (incomingData.users !== undefined) {
          this.playersListQueue = incomingData.users;
        }
      });
  }

  startGame() {
    this.gameService.startGame(this.gameType).subscribe(data => {
      // @ts-ignore
      if (data.data === true) this.closeSpinner();
    });
  }

  closeSpinner() {
    this.waitingForStart = false;
  }

  exitGame(){
    this.roomsService.exitRoom().subscribe()
  }
}
