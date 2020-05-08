import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-opponent-panel',
  templateUrl: './opponent-panel.component.html',
  styleUrls: ['./opponent-panel.component.css', '../card-image.css']
})
export class OpponentPanelComponent implements OnInit {
  @Input('vertical') isVertical: boolean = false;

  numberOfCards = 4;

  gridStyle() {
    return this.isVertical ?
    {'grid-template-rows': `repeat(${this.numberOfCards - 1}, 16px) 120px`} :
    {'grid-template-columns': `repeat(${this.numberOfCards - 1}, 16px) 120px`};
  };

  cardStyle(i: number) {
    return this.isVertical ?
    {'grid-row': +(i+1), 'z-index': +i} :
    {'grid-column': +(i+1), 'z-index': +i}
  }

  constructor() { }

  ngOnInit(): void {
  }

}
