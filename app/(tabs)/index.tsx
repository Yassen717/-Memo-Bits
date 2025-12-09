import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import GameBoard from '@/components/game/GameBoard';
import WinModal from '@/components/game/WinModal';
import useGameLogic from '@/hooks/useGameLogic';

export default function GameScreen() {
  const { cards, moves, isWon, isChecking, handleCardPress, resetGame } = useGameLogic();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Memo Bits</Text>
        <Text style={styles.subtitle}>Find all matching pairs!</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>

      <GameBoard
        cards={cards}
        onCardPress={handleCardPress}
        disabled={isChecking}
      />

      <TouchableOpacity
        style={styles.newGameButton}
        onPress={resetGame}
        activeOpacity={0.8}
      >
        <Text style={styles.newGameText}>New Game</Text>
      </TouchableOpacity>

      <WinModal
        visible={isWon}
        moves={moves}
        onPlayAgain={resetGame}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  stats: {
    marginBottom: 16,
  },
  movesText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  newGameButton: {
    marginTop: 24,
    backgroundColor: '#444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newGameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
