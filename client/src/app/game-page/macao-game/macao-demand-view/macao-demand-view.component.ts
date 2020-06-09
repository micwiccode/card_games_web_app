import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GameService } from "../../../services/game.service";
import { Card } from "../../Card";
import { Turn } from "../../turn";
import { Action } from "../../Action";

@Component({
  selector: "app-macao-demand-view",
  templateUrl: "./macao-demand-view.component.html",
  styleUrls: ["../../../../css/button.css", "./macao-demand-view.component.css"]
})
export class MacaoDemandViewComponent implements OnInit {
  @Input() demandVersion: string = null;
  @Output() messageEvent = new EventEmitter<string>();
  demandFigure: string = "5";
  demandColor: string = "C";

  constructor() {}

  ngOnInit(): void {}

  changeDemandFigure(figure: any) {
    this.demandFigure = figure.value;
  }

  changeDemandColor(color: any) {
    this.demandColor = color.value;
  }

  answerQuestion() {
    if (this.demandVersion === "J") {
      this.messageEvent.emit(this.demandFigure);
    } else this.messageEvent.emit(this.demandColor);
  }
}
