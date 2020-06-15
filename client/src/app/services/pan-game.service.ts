import { Injectable, NgZone } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Card } from "../game-page/Card";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { SseService } from "./sse-service.service";
import { Deck } from "../game-page/Deck";
import { Turn } from "../game-page/turn";
import { Action } from "../game-page/Action";

@Injectable({
  providedIn: "root"
})
export class PanGameService {
  header = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("token")).tokenValue
    }`
  };

  private playerDeck = new BehaviorSubject<Deck>(null);
  playerDeck$ = this.playerDeck.asObservable();

  private opponentsDecks = new BehaviorSubject<Deck[]>([]);
  opponentsDecks$ = this.opponentsDecks.asObservable();

  private turn = new BehaviorSubject<Turn>(null);
  turn$ = this.turn.asObservable();

  private currentTopCards = new BehaviorSubject<Card[]>([]);
  currentTopCards$ = this.currentTopCards.asObservable();

  private isPossibleMoveFlag = new BehaviorSubject<boolean>(true);
  isPossibleMoveFlag$ = this.isPossibleMoveFlag.asObservable();

  private isEnd = new BehaviorSubject<boolean>(false);
  isEnd$ = this.isEnd.asObservable();

  roomID: string;
  userID: number = null;

  constructor(
    private http: HttpClient,
    private sseService: SseService,
    private zone: NgZone
  ) { }

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

  closeServerSendEvents() {
    this.sseService.closeEventSources();
  }

  startGame() {
    this.initStart();
    return this.http
      .post(`${environment.API_URL}/room/${this.roomID}/start`, this.header)
      .pipe();
  }

  initStart() {
    this.roomID = localStorage.getItem("roomID");
  }

  initGame(incomingData, userID) {
    this.userID = userID;
    const decks = incomingData.cards;
    const turn: Turn = {
      id: incomingData.turn.id,
      userName: incomingData.turn.username
    };
    this.turn.next(turn);
    
    this.changeTopCards([]);

    let playerDeck = null;
    let opponentsDecks = [];
    decks.forEach(deck => {
      if (deck.userId === userID) playerDeck = deck;
      else opponentsDecks.push(deck);
    });
    this.initPlayerDeck(playerDeck, turn.id);
    this.initOpponentsDeck(opponentsDecks, turn.id);
  }

  initRound(incomingData) {
    this.changeTopCards(incomingData.topCards);    

    const opponentsDecks: Deck[] = this.opponentsDecks.value;
    opponentsDecks.forEach(deck => {
      if (deck.userID === incomingData.userId) {
        deck.numberOfCards -= incomingData.howMany;
      }
    });

    this.initNextPlayer(incomingData);

    if (this.isEnd !== incomingData.isEnd) {
      this.isEnd = incomingData.isEnd;
    }
  }

  initDraw(incomingData) {
    const opponentsDecks: Deck[] = this.opponentsDecks.value;
    opponentsDecks.forEach(deck => {
      if (deck.userID === incomingData.userId) {
        deck.numberOfCards += incomingData.howMany;
      }
    });

    this.initNextPlayer(incomingData);
  }

  initNextPlayer(incomingData) {
    const nextUserId = incomingData.nextUserId;
    const newTurn: Turn = {
      id: nextUserId,
      userName: incomingData.nextUsername
    };
    this.turn.next(newTurn);
    this.changeArrowPosition(nextUserId);
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
    this.isPossibleMove();
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

  changeTopCards(topCardsAliases: string[]) {
    this.currentTopCards.next(
      topCardsAliases.map(alias => {
        return {
          value: alias,
          image: `https://deckofcardsapi.com/static/img/${alias}.png`
        }
      })
    );
  }

  changeArrowPosition(nextUserId: number) {
    const opponentsDecks: Deck[] = this.opponentsDecks.value;
    const oppDecks: Deck[] = [];
    opponentsDecks.forEach(deck => {
      const currentOpponentDeck: Deck = {
        ...deck,
        isUserTurn: nextUserId === deck.userID
      };
      oppDecks.push(currentOpponentDeck);
    });
    this.opponentsDecks.next(oppDecks);
    const playerDeck: Deck = this.playerDeck.value;
    const deck: Deck = {
      ...playerDeck,
      isUserTurn: playerDeck.userID === nextUserId
    };
    this.playerDeck.next(deck);
  }

  drawCards() {
    if (this.canDrawCard()) {
      return this.http
        .post(
          `${environment.API_URL}/room/${this.roomID}/pan/drawCards`,
          {},
          { headers: this.header }
        )
        .pipe()
        .subscribe(data => {
          console.log(data);
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
        });
    }
  }

  private canDrawCard(): boolean {
    return this.turn.value.id === this.userID;
  }

  playCards(cardsAliasList: string[]) {
    console.log({ cards: cardsAliasList });
    this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/pan/playCards`,
        { cards: cardsAliasList },
        { headers: this.header }
      )
      .pipe()
      .subscribe();
    this.removeCardsFromDeck(cardsAliasList);
  }

  removeCardsFromDeck(cardsAliasList: string[]) {
    const playerDeck: Deck = this.playerDeck.value;
    const playerCards: Card[] = playerDeck.cards;
    const newPlayerCards: Card[] = [];
    playerCards.forEach(card => {
      if (!cardsAliasList.includes(card.value)) {
        newPlayerCards.push(card);
      }
    });
    this.playerDeck.next({
      ...playerDeck,
      cards: newPlayerCards
    });
  }

  addCardToDeck(cardsToAdd: Card[]) {
    this.playerDeck.next({
      ...this.playerDeck.value,
      cards: this.playerDeck.value.cards.concat(cardsToAdd)
    });
  }

  isCardValid(selectedCardAlias: string, previousCardsAliases: string[]) {
    console.log(previousCardsAliases);
    if (previousCardsAliases.length === 4) {
      return false;
    }

    if (this.currentTopCards.value.length === 0) {
      return selectedCardAlias === '9H';
    }

    const topCardAlias = this.currentTopCards.value[this.currentTopCards.value.length - 1].value;

    if (previousCardsAliases.length === 3 && topCardAlias === '9H') {
      return false;
    }

    if (previousCardsAliases.length <= 3 && previousCardsAliases.length >= 1) {
      console.log(selectedCardAlias);
      return selectedCardAlias[0] === previousCardsAliases[0][0];
    }

    return this.getNumberFromAlias(selectedCardAlias) >= this.getNumberFromAlias(topCardAlias);

  }

  private getNumberFromAlias(figure: string): number {
    switch (figure[0]) {
      case '9':
        return 9;
      case '0':
        return 10;
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
    }
  }

  isPossibleMove() {
    const userCards = this.playerDeck.value.cards;

    if (this.currentTopCards.value.length === 0) {
      this.isPossibleMoveFlag.next(
        userCards.some(card => card.value === '9H'));      
    }
    else {
      const currentTableCardAlias = this.currentTopCards[0].value.value;      
      this.isPossibleMoveFlag.next(
        userCards.some(card => this.getNumberFromAlias(card.value) >= this.getNumberFromAlias(currentTableCardAlias)));      
    }
  }
}
