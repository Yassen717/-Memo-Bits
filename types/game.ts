export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  moves: number;
  selectedCards: number[];
  isWon: boolean;
  isChecking: boolean;
}
