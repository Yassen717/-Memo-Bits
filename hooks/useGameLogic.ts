import { useState, useEffect } from 'react';
import { Card, GameState } from '@/types/game';

const EMOJIS = ['🎮', '🚀', '💾', '🐛', '🎯', '🎨', '🎵', '🔥'];

export default function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  function initializeGame(): GameState {
    // Create pairs of cards
    const cards: Card[] = [];
    EMOJIS.forEach((emoji, index) => {
      cards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle using Fisher-Yates algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return {
      cards,
      moves: 0,
      selectedCards: [],
      isWon: false,
      isChecking: false,
    };
  }

  function handleCardPress(id: number) {
    if (gameState.isChecking || gameState.selectedCards.length >= 2) return;

    const card = gameState.cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newSelectedCards = [...gameState.selectedCards, id];
    const newCards = gameState.cards.map(c =>
      c.id === id ? { ...c, isFlipped: true } : c
    );

    setGameState({
      ...gameState,
      cards: newCards,
      selectedCards: newSelectedCards,
    });
  }

  useEffect(() => {
    if (gameState.selectedCards.length === 2) {
      setGameState(prev => ({ ...prev, isChecking: true }));

      const [firstId, secondId] = gameState.selectedCards;
      const firstCard = gameState.cards.find(c => c.id === firstId);
      const secondCard = gameState.cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        const newCards = gameState.cards.map(c =>
          c.id === firstId || c.id === secondId
            ? { ...c, isMatched: true }
            : c
        );

        setGameState(prev => ({
          ...prev,
          cards: newCards,
          moves: prev.moves + 1,
          selectedCards: [],
          isChecking: false,
        }));

        // Check win condition
        if (newCards.every(c => c.isMatched)) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, isWon: true }));
          }, 500);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          const newCards = gameState.cards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          );

          setGameState(prev => ({
            ...prev,
            cards: newCards,
            moves: prev.moves + 1,
            selectedCards: [],
            isChecking: false,
          }));
        }, 1000);
      }
    }
  }, [gameState.selectedCards.length]);

  function resetGame() {
    setGameState(initializeGame());
  }

  return {
    cards: gameState.cards,
    moves: gameState.moves,
    isWon: gameState.isWon,
    isChecking: gameState.isChecking,
    handleCardPress,
    resetGame,
  };
}
