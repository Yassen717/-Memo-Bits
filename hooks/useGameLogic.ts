import { Card, GameState } from '@/types/game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';

const EMOJIS = ['🎮', '🚀', '💾', '🐛', '🎯', '🎨', '🎵', '🔥'];
const BEST_SCORE_KEY = '@memo_bits_best_score';

export default function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const winTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setGameState(prev => {
      if (prev.isChecking || prev.selectedCards.length >= 2) return prev;

      const card = prev.cards.find(c => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return prev;

      const newSelectedCards = [...prev.selectedCards, id];
      const newCards = prev.cards.map(c =>
        c.id === id ? { ...c, isFlipped: true } : c
      );

      return {
        ...prev,
        cards: newCards,
        selectedCards: newSelectedCards,
      };
    });
  }

  useEffect(() => {
    if (gameState.selectedCards.length !== 2 || gameState.isChecking) return;

    setGameState(prev => ({ ...prev, isChecking: true }));

    const [firstId, secondId] = gameState.selectedCards;
    const firstCard = gameState.cards.find(c => c.id === firstId);
    const secondCard = gameState.cards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const newCards = gameState.cards.map(c =>
        c.id === firstId || c.id === secondId
          ? { ...c, isMatched: true }
          : c
      );

      const finalMoves = gameState.moves + 1;

      setGameState(prev => ({
        ...prev,
        cards: newCards,
        moves: prev.moves + 1,
        selectedCards: [],
        isChecking: false,
      }));

      if (newCards.every(c => c.isMatched)) {
        if (bestScore === null || finalMoves < bestScore) {
          setIsNewRecord(true);
          saveBestScore(finalMoves);
        } else {
          setIsNewRecord(false);
        }

        if (winTimeoutRef.current) {
          clearTimeout(winTimeoutRef.current);
        }

        winTimeoutRef.current = setTimeout(() => {
          setGameState(prev => ({ ...prev, isWon: true }));
        }, 500);
      }

      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    checkTimeoutRef.current = setTimeout(() => {
      setGameState(prev => {
        const newCards = prev.cards.map(c =>
          c.id === firstId || c.id === secondId
            ? { ...c, isFlipped: false }
            : c
        );

        return {
          ...prev,
          cards: newCards,
          moves: prev.moves + 1,
          selectedCards: [],
          isChecking: false,
        };
      });
    }, 1000);
  }, [bestScore, gameState.cards, gameState.isChecking, gameState.moves, gameState.selectedCards]);

  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }

      if (winTimeoutRef.current) {
        clearTimeout(winTimeoutRef.current);
      }
    };
  }, []);

  function resetGame() {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    if (winTimeoutRef.current) {
      clearTimeout(winTimeoutRef.current);
    }

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
