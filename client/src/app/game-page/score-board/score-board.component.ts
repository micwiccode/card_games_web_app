import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {

  players = [
    {name: 'Pierwszy', score: 231},
    {name: 'Drugi', score: 92},
    {name: 'Trzeci', score: 2},
    {name: 'Czwarty', score: 873}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
