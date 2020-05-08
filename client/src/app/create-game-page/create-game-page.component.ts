import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RoomsService } from "../services/rooms.service";
import { ValidateService } from "../services/validate.service";

@Component({
  selector: "app-create-game-page",
  templateUrl: "./create-game-page.component.html",
  styleUrls: [
    "./create-game-page.component.css",
    "../../css/menu-error.css",
    "../../css/button.css"
  ]
})
export class CreateGamePageComponent implements OnInit {
  roomName: string;
  maxPlayers = [1, 2, 3, 4];
  selectedNumber = "";
  password = null;
  constructor(
    private roomsService: RoomsService,
    private validateService: ValidateService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createRoomSubmit() {
    const newRoom = {
      name: this.roomName,
      maxPeople: this.selectedNumber,
      password: this.password
    };
    const errorLabel: HTMLElement = document.querySelector(
      ".menu__error"
    ) as HTMLElement;
    const validateResponse = this.validateService.validateRoom(newRoom);
    if (validateResponse.isValid) {
      this.roomsService.createRoom(newRoom).subscribe(data => {
        // @ts-ignore
        if (data.error === null) {
          // @ts-ignore
          localStorage.setItem("roomID", data.data.id);
          this.router.navigate(["/rooms"]);
        } else {
          errorLabel.style.display = "block";
          // @ts-ignore
          errorLabel.textContent = data.error;
        }
      });
      errorLabel.style.display = "none";
    } else {
      errorLabel.textContent = validateResponse.msg;
      errorLabel.style.display = "block";
    }
  }
}
