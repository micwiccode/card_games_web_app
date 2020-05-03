import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-game-page',
  templateUrl: './create-game-page.component.html',
  styleUrls: [
    './create-game-page.component.css',
    '../../css/menu-error.css',
    '../../css/button.css',
  ],
})
export class CreateGamePageComponent implements OnInit {
  roomName: string;
  maxPlayers = [1, 2, 3, 4];
  selectedNumber = '';
  password = null;
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  createRoomSubmit() {
    const newRoom = {
      name: this.roomName,
      maxPeople: this.selectedNumber,
      password: this.password,
    };
  }
}
