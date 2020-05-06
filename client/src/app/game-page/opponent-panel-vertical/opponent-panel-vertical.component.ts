import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opponent-panel-vertical',
  templateUrl: './opponent-panel-vertical.component.html',
  styleUrls: ['./opponent-panel-vertical.component.css','../card-image.css']
})
export class OpponentPanelVerticalComponent implements OnInit {
  numberOfCards = 5;

  constructor() { }

  ngOnInit(): void {
  }

}
