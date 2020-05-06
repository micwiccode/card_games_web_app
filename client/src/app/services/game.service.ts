import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Card } from '../game-page/card';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private deckId: string;
  private playerCards = new BehaviorSubject<Card[]>([]);
  private lastPlayedCard = new Subject<Card>();

  playerCards$ = this.playerCards.asObservable();
  lastPlayedCard$ = this.lastPlayedCard.asObservable();

  constructor(private http: HttpClient) { }

  newGame() {
    return this.http.get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').pipe(
      map(response => {
        this.deckId = response.deck_id
        return true;
      })
    )
  }  

  drawCard() {
    return this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`).subscribe(
      response => this.playerCards.next(this.playerCards.value.concat(response.cards))
    )
  }

  playCard(card: Card) {
    var index = this.playerCards.value.indexOf(card);
    this.playerCards.value.splice(index, 1);
    this.lastPlayedCard.next(card);
  }
}
