import { Card } from "./Card";

export interface Deck {
  userID: number;
  userName: string;
  isUserTurn: boolean;
  numberOfCards: number;
  cards: Card[];
}
