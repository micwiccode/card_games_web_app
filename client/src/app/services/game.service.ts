import { Injectable, NgZone } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Card } from "../game-page/card";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { SseService } from "./sse-service.service";
import { Deck } from "../game-page/deck";
import { Turn } from "../game-page/turn";

@Injectable({
  providedIn: "root"
})
export class GameService {
  header = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  private playerDeck = new BehaviorSubject<Deck>(
    new (class implements Deck {
      cards: Card[];
      isUserTurn: boolean = true;
      numberOfCards: number;
      userID: number;
      userName: string;
    })()
  );
  playerDeck$ = this.playerDeck.asObservable();
  private opponentsDecks = new BehaviorSubject<Deck[]>([]);
  opponentsDecks$ = this.opponentsDecks.asObservable();
  private turn = new BehaviorSubject<Turn>(
    new (class implements Turn {
      id: number;
      userName: string;
    })()
  );
  turn$ = this.turn.asObservable();
  private currentTableCard = new BehaviorSubject<Card>(
    new (class implements Card {
      value: string;
      image: string;
    })()
  );
  currentTableCard$ = this.currentTableCard.asObservable();

  private isPossibleMoveFlag = new BehaviorSubject<boolean>(true);
  isPossibleMoveFlag$ = this.isPossibleMoveFlag.asObservable();

  roomID: string;
  userID = null;

  constructor(
    private http: HttpClient,
    private sseService: SseService,
    private zone: NgZone
  ) {}

  getServerSendEvent(url: string) {
    return new Observable(observer => {
      const eventSource = this.sseService.getEventSource(url);
      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(event);
        });
      };
      eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  startGame() {
    this.roomID = localStorage.getItem("roomID");
    return this.http
      .post(`${environment.API_URL}/room/${this.roomID}/start`, this.header)
      .pipe();
  }

  initGame(incomingData, userID) {
    const decks = incomingData.start.cards;
    const turn: Turn = {
      id: incomingData.start.turn.id,
      userName: incomingData.start.turn.username
    };
    this.turn.next(turn);
    const startCard = incomingData.start.startCard;
    const currentTableCard: Card = {
      value: startCard,
      image: `https://deckofcardsapi.com/static/img/${startCard}.png`
    };
    this.currentTableCard.next(currentTableCard);
    let playerDeck = null;
    let opponentsDecks = [];
    decks.forEach(deck => {
      if (deck.userId === userID) playerDeck = deck;
      else opponentsDecks.push(deck);
    });
    this.initPlayerDeck(playerDeck, turn.id);
    this.initOpponentsDeck(opponentsDecks, turn.id);
  }

  initPlayerDeck(playerDeck, turnPlayerID) {
    const cards: Card[] = [];
    playerDeck.deck.forEach(cardCode => {
      const card: Card = {
        value: cardCode,
        image: `https://deckofcardsapi.com/static/img/${cardCode}.png`
      };
      cards.push(card);
    });
    const deck: Deck = {
      userID: playerDeck.userId,
      userName: playerDeck.username,
      isUserTurn: turnPlayerID === playerDeck.userId,
      numberOfCards: cards.length,
      cards: cards
    };
    this.playerDeck.next(deck);
  }

  initOpponentsDeck(opponentsDecks, turnPlayerID) {
    const oppDecks: Deck[] = [];
    opponentsDecks.forEach(deck => {
      const currentOpponentDeck: Deck = {
        userID: deck.userId,
        userName: deck.username,
        isUserTurn: turnPlayerID === deck.userId,
        numberOfCards: deck.deck.length,
        cards: null
      };
      oppDecks.push(currentOpponentDeck);
    });
    this.opponentsDecks.next(oppDecks);
  }

  drawCards(cardsNumber: number) {
    return this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/drawCards`,
        { cardsNumber },
        { headers: this.header }
      )
      .pipe()
      .subscribe(data => {
        const cards: Card[] = [];
        // @ts-ignore
        data.data.cards.forEach(cardAlias => {
          const card: Card = {
            value: cardAlias,
            image: `https://deckofcardsapi.com/static/img/${cardAlias}.png`
          };
          cards.push(card);
        });
        this.addCardToDeck(cards);
        if (!this.isPossibleMove()) this.nextPlayer();
      });
  }

  playCards(cardsAliasList: string[]) {
    console.log(cardsAliasList);
    return this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/playCards`,
        { cards: cardsAliasList },
        { headers: this.header }
      )
      .pipe()
      .subscribe();
  }

  addCardToDeck(cardsToAdd: Card[]) {
    this.playerDeck.next({
      ...this.playerDeck.value,
      cards: this.playerDeck.value.cards.concat(cardsToAdd)
    });
  }

  isCardValid(
    selectedCardAlias: string,
    lastCardAlias: string = this.currentTableCard.value.value
  ) {
    const figure = selectedCardAlias[0];
    const color = selectedCardAlias[1];
    return lastCardAlias.includes(figure) || lastCardAlias.includes(color);
  }

  isPossibleMove() {
    let isPossible = false;
    const currentTableCardAlias = this.currentTableCard.value.value;
    const figure = currentTableCardAlias[0];
    const color = currentTableCardAlias[1];
    const userCards = this.playerDeck.value.cards;
    userCards.forEach(card => {
      if (card.value.includes(figure) || card.value.includes(color)) {
        isPossible = true;
      }
    });
    return isPossible;
  }

  nextPlayer() {
    return this.http
      .post(`${environment.API_URL}/room/${this.roomID}/nextPlayer`, {
        headers: this.header
      })
      .pipe()
      .subscribe();
  }
}
