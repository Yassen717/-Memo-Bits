import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Card, GameState } from '@/types/game';

const EMOJIS = ['🎮', '🚀', '💾', '🐛', '🎯', '🎨', '🎵', '🔥'];
const BEST_SCORE_KEY = '@memo_bits_best_score';

export default function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Load best score on mount
  useEffect(() => {
    loadBestScore();
  }, []);

  async function loadBestScore() {
    try {
      const score = await AsyncStorage.getItem(BEST_SCORE_KEY);
      if (score !== null) {
        setBestScore(parseInt(score, 10));
      }
    } catch (error) {
      console.error('Error loading best score:', error);
    }
  }

  async function saveBestScore(score: number) {
    try {
      await AsyncStorage.setItem(BEST_SCORE_KEY, score.toString());
      setBestScore(score);
    } catch (error) {
      console.error('Error saving best score:', error);
    }
  }

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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
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
          const finalMoves = gameState.moves + 1;
          
          // Check if new record
          if (bestScore === null || finalMoves < bestScore) {
            setIsNewRecord(true);
            saveBestScore(finalMoves);
          } else {
            setIsNewRecord(false);
          }
          
          setTimeout(() => {
            setGameState(prev => ({ ...prev, isWon: true }));
          }, 500);
        }
      } else {
        // No match - flip back after delay
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        
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
    setIsNewRecord(false);
  }

  return {
    cards: gameState.cards,
    moves: gameState.moves,
    isWon: gameState.isWon,
    isChecking: gameState.isChecking,
    bestScore,
    isNewRecord,
    handleCardPress,
    resetGame,
  };
}
