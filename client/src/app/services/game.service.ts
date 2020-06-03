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
export class GameService {
  header = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  private playerDeck = new BehaviorSubject<Deck>(null);
  playerDeck$ = this.playerDeck.asObservable();

  private opponentsDecks = new BehaviorSubject<Deck[]>([]);
  opponentsDecks$ = this.opponentsDecks.asObservable();

  private turn = new BehaviorSubject<Turn>(null);
  turn$ = this.turn.asObservable();
  private currentTableCard = new BehaviorSubject<Card>(null);
  currentTableCard$ = this.currentTableCard.asObservable();

  private isPossibleMoveFlag = new BehaviorSubject<boolean>(true);
  isPossibleMoveFlag$ = this.isPossibleMoveFlag.asObservable();

  private currentAction = new BehaviorSubject<Action>(null);
  currentAction$ = this.currentAction.asObservable();

  private isEnd = new BehaviorSubject<boolean>(false);
  isEnd$ = this.isEnd.asObservable();

  private isTableCardTaken = new BehaviorSubject<boolean>(false);
  isTableCardTaken$ = this.isTableCardTaken.asObservable();

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

  closeServerSendEvents() {
    this.sseService.closeEventSources();
  }

  startGame() {
    this.roomID = localStorage.getItem("roomID");
    return this.http
      .post(`${environment.API_URL}/room/${this.roomID}/start`, this.header)
      .pipe();
  }

  initGame(incomingData, userID) {
    const decks = incomingData.cards;
    const turn: Turn = {
      id: incomingData.turn.id,
      userName: incomingData.turn.username
    };
    this.turn.next(turn);
    const startCard = incomingData.startCard;
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

  initRound(incomingData) {
    if (this.isEnd !== incomingData.isEnd) this.isEnd = incomingData.isEnd;
    if (incomingData.action.target === this.userID) {
      if (incomingData.action.type === "Nothing") {
        this.currentAction.next(null);
      }
      this.currentAction.next(incomingData.action);
    }
  }

  initDraw(incomingData) {
    const opponentsDecks: Deck[] = this.opponentsDecks.value;
    const userDeck: Deck = opponentsDecks.find(deck => {
      deck.userID = incomingData.userId;
    });
    if (userDeck) {
      userDeck.numberOfCards += incomingData.newCards;
      this.opponentsDecks.next(opponentsDecks);
    }
  }

  initNextPlayer(incomingData) {
    this.turn.next(incomingData.userId);
    if (incomingData.userId === this.userID) this.resetTableCard();
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

  drawCards(cardsNumber: number) {
    if (this.currentAction.value !== null) {
      const actionType = this.currentAction.value.type;
      if (actionType === "Request" || actionType === "Color change") {
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
            this.isPossibleMove();
          });
      }
    }
  }

  makeActionDone() {
    this.currentAction.next(null);
  }

  playCards(cardsAliasList: string[], demandValue: string) {
    console.log(cardsAliasList);
    console.log(demandValue);
    this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/playCards`,
        { cards: cardsAliasList, request: demandValue },
        { headers: this.header }
      )
      .pipe()
      .subscribe();
    this.removeCardsFromDeck(cardsAliasList);
    this.nextPlayer();
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

  isCardValid(
    selectedCardAlias: string,
    lastCardAlias: string,
    currentAction: Action
  ) {
    const figure = selectedCardAlias[0];
    const color = selectedCardAlias[1];
    if(lastCardAlias === undefined){
      lastCardAlias = this.currentTableCard.value.value
      if (currentAction === null)
        return lastCardAlias.includes(figure) || lastCardAlias.includes(color);
      if (currentAction.type === "Draw") {
        if (figure === selectedCardAlias[0] && figure === "K") {
          return color === "S" || color === "H";
        } else {
          return (
            figure === lastCardAlias[0] ||
            (color === lastCardAlias[1] && (figure === "2" || figure === "3"))
          );
        }
      } else if (currentAction.type === "Stop") return figure === "4";
      else if (currentAction.type === "Request")
        return figure === currentAction.content;
      else if (currentAction.type === "Color change")
        return color === currentAction.content;
      else if (currentAction.type === "Draw previous")
        return (
          selectedCardAlias === "KH" ||
          selectedCardAlias === "2S" ||
          selectedCardAlias === "3S"
        );
      else return figure === lastCardAlias[0] || color === lastCardAlias[1];
    }
    else return figure === lastCardAlias[0];
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
    this.isPossibleMoveFlag.next(isPossible);
  }

  nextPlayer() {
    return this.http
      .post(`${environment.API_URL}/room/${this.roomID}/nextPlayer`, {
        headers: this.header
      })
      .pipe()
      .subscribe();
  }

  setTableCardAsTaken() {
    this.isTableCardTaken.next(true);
  }

  resetTableCard() {
    this.isTableCardTaken.next(false);
  }
}
