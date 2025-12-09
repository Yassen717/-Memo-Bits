import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from './Card';
import { Card as CardType } from '@/types/game';

interface GameBoardProps {
  cards: CardType[];
  onCardPress: (id: number) => void;
  disabled: boolean;
}

export default function GameBoard({ cards, onCardPress, disabled }: GameBoardProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 320,
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
});
