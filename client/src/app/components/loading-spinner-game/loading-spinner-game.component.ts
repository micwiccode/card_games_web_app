import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading-spinner-game',
  templateUrl: './loading-spinner-game.component.html',
  styleUrls: [
    './loading-spinner-game.component.css',
    '../../../css/button.css',
  ],
})
export class LoadingSpinnerGameComponent implements OnInit {
  @Input() isGameAdmin: boolean;
  @Input() playersListQueue: any;
  @Output() messageEvent = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  startGame() {
    this.messageEvent.emit();
  }
}
