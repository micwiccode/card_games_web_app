import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-opponent-panel',
  templateUrl: './opponent-panel.component.html',
  styleUrls: ['./opponent-panel.component.css', '../card-image.css']
})
export class OpponentPanelComponent implements OnInit {
  numberOfCards = 4;

  constructor() { }

  ngOnInit(): void {
  }

}
