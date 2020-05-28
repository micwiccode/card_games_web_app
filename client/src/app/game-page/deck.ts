import { Card } from "./card";

export interface Deck {
  userID: number;
  userName: string;
  isUserTurn: boolean;
  numberOfCards: number;
  cards: Card[];
}
