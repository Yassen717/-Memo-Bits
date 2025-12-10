import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from './Card';
import { Card as CardType } from '@/types/game';

interface GameBoardProps {
  cards: CardType[];
  onCardPress: (id: number) => void;
  disabled: boolean;
}

export default function GameBoard({ cards, onCardPress, disabled }: GameBoardProps) {
  return (
    <View style={styles.boardContainer}>
      <LinearGradient
        colors={['rgba(26, 26, 26, 0.8)', 'rgba(42, 42, 42, 0.6)']}
        style={styles.boardGradient}
      >
        <View style={styles.board}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onPress={onCardPress}
              disabled={disabled}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  boardGradient: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(45, 134, 89, 0.3)',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 320,
    padding: 12,
  },
});
