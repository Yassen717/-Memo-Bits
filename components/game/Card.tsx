import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Card as CardType } from '@/types/game';

interface CardProps {
  card: CardType;
  onPress: (id: number) => void;
  disabled: boolean;
}

export default function Card({ card, onPress, disabled }: CardProps) {
  const showFace = card.isFlipped || card.isMatched;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        showFace && styles.cardFlipped,
        card.isMatched && styles.cardMatched,
      ]}
      onPress={() => onPress(card.id)}
      disabled={disabled || card.isMatched}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>
        {showFace ? card.emoji : '?'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 70,
    height: 70,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  cardFlipped: {
    backgroundColor: '#3a3a3a',
    borderColor: '#666',
  },
  cardMatched: {
    backgroundColor: '#1a4d2e',
    borderColor: '#2d8659',
  },
  emoji: {
    fontSize: 32,
  },
});
