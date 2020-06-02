import {Component, DoCheck} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  isLogged: boolean = false;

  constructor() {}

  ngDoCheck(): void {
    this.isLogged = localStorage.getItem('username') !== null;
  }
}
