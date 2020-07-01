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
export class MacaoGameService {
  private playerDeck = new BehaviorSubject<Deck>(null);
  playerDeck$ = this.playerDeck.asObservable();

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

  private opponentsDecks = new BehaviorSubject<Deck[]>([]);
  opponentsDecks$ = this.opponentsDecks.asObservable();

  roomID: string;
  userID: number = null;

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
    this.initStart();
    return this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/start`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token")).tokenValue
            }`
          }
        }
      )
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
    const startCard = incomingData.startCard;
    this.changeTableCard(startCard);
    let playerDeck = null;
    let opponentsDecks = [];
    decks.forEach(deck => {
      if (deck.userId === userID) playerDeck = deck.deck;
      else opponentsDecks.push(deck);
    });
    this.initPlayerDeck(playerDeck, turn.id);
    this.initOpponentsDeck(opponentsDecks, turn.id);
  }

  initRound(incomingData) {
    if (incomingData.isEnd) this.isEnd.next(incomingData.isEnd);
    const target = incomingData.action.target;
    const nextUserId = target.userId;
    const newTurn: Turn = {
      id: nextUserId,
      userName: target.username
    };
    this.turn.next(newTurn);
    this.changeTableCard(incomingData.topCard);
    this.changeArrowPosition(
      nextUserId,
      incomingData.userId,
      incomingData.playedCards
    );
    if (incomingData.action.type === "Request") {
      this.currentAction.next(incomingData.action);
    }
    let shouldNewAction = true;
    if (
      this.currentAction.value !== null &&
      this.currentAction.value.type === "Request"
    ) {
      shouldNewAction = false;
    }
    if (shouldNewAction) {
      if (incomingData.action.type === "Nothing") {
        this.currentAction.next(null);
      } else {
        if (target.userId === this.userID) {
          this.currentAction.next(incomingData.action);
        }
      }
      this.isPossibleMove();
    }
  }

  initDraw(incomingData) {
    const opponentsDecks: Deck[] = this.opponentsDecks.value;
    opponentsDecks.forEach(deck => {
      if (deck.userID === incomingData.userId) {
        deck.numberOfCards += incomingData.newCards;
      }
    });
    // this.initNextPlayer(incomingData);
  }

  initNextPlayer(incomingData) {
    const nextUserId = incomingData.userId;
    const newTurn: Turn = {
      id: nextUserId,
      userName: incomingData.username
    };
    this.turn.next(newTurn);
    this.changeArrowPosition(nextUserId);
    if (nextUserId === this.userID) {
      this.isPossibleMove();
      this.resetTableCard();
    }
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
    if (turnPlayerID === playerDeck.userId) this.isPossibleMove();
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

  changeTableCard(tableCardAlias: string) {
    const newTopCard: Card = {
      value: tableCardAlias,
      image: `https://deckofcardsapi.com/static/img/${tableCardAlias}.png`
    };
    this.currentTableCard.next(newTopCard);
  }

  changeArrowPosition(
    nextUserId: number,
    previousOpponentID = null,
    playedCardNumber = 0
  ) {
    const opponentsDecks: Deck[] = this.opponentsDecks.value;
    const oppDecks: Deck[] = [];
    opponentsDecks.forEach(deck => {
      const currentOpponentDeck: Deck = {
        ...deck,
        isUserTurn: nextUserId === deck.userID,
        numberOfCards:
          previousOpponentID === deck.userID
            ? (deck.numberOfCards -= playedCardNumber)
            : deck.numberOfCards
      };
      oppDecks.push(currentOpponentDeck);
    });
    this.opponentsDecks.next(oppDecks);
    const playerDeck: Deck = this.playerDeck.value;
    const deck: Deck = {
      ...playerDeck,
      isUserTurn: nextUserId === playerDeck.userID
    };
    this.playerDeck.next(deck);
  }

  drawCards(cardsNumber: number, isAction: boolean) {
    if (isAction || this.canDrawCard()) {
      this.setTableCardAsTaken();
      return this.http
        .post(
          `${environment.API_URL}/room/${this.roomID}/drawCards`,
          { cardsNumber },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("token")).tokenValue
              }`
            }
          }
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
          if (!isAction) this.isPossibleMove();
        });
    }
  }

  canDrawCard(): boolean {
    if (this.turn.value.id !== this.userID) return false;
    if (this.isTableCardTaken.value === true) return false;
    if (this.currentAction.value === null) return true;
    else {
      const actionType = this.currentAction.value.type;
      return !(
        actionType === "Draw" ||
        actionType === "Stop" ||
        actionType === "Draw previous"
      );
    }
  }

  makeActionDone() {
    this.currentAction.next(null);
    this.isPossibleMoveFlag.next(true);
  }

  makeStopAction() {
    this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/stay`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token")).tokenValue
            }`
          }
        }
      )
      .pipe()
      .subscribe();
  }

  playCards(cardsAliasList: string[], demandValue: string) {
    this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/playCards`,
        { cards: cardsAliasList, request: demandValue },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token")).tokenValue
            }`
          }
        }
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

  isCardValid(
    selectedCardAlias: string,
    lastCardAlias: string,
    currentAction: Action
  ) {
    const figure = selectedCardAlias[0];
    const color = selectedCardAlias[1];
    if (lastCardAlias === undefined) {
      lastCardAlias = this.currentTableCard.value.value;
      if (currentAction === null) {
        if (figure === "Q") return true;
        else
          return (
            lastCardAlias.includes("Q") ||
            lastCardAlias.includes(figure) ||
            lastCardAlias.includes(color)
          );
      } else if (currentAction.type === "Draw") {
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
    } else return figure === lastCardAlias[0];
  }

  isPossibleMove() {
    let isPossible = false;
    const currentTableCardAlias = this.currentTableCard.value.value;
    const figure = currentTableCardAlias[0];
    const color = currentTableCardAlias[1];
    if (figure === "Q") {
      isPossible = true;
    } else {
      const userCards = this.playerDeck.value.cards;
      userCards.forEach(card => {
        if (
          card.value.includes("Q") ||
          card.value.includes(figure) ||
          card.value.includes(color)
        ) {
          isPossible = true;
        }
      });
    }
    this.isPossibleMoveFlag.next(isPossible);
  }

  nextPlayer() {
    this.isTableCardTaken.next(false);
    return this.http
      .post(
        `${environment.API_URL}/room/${this.roomID}/nextUser`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token")).tokenValue
            }`
          }
        }
      )
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
