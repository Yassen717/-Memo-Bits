import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import GameBoard from '@/components/game/GameBoard';
import WinModal from '@/components/game/WinModal';
import useGameLogic from '@/hooks/useGameLogic';

export default function GameScreen() {
  const { cards, moves, isWon, isChecking, handleCardPress, resetGame } = useGameLogic();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  }, []);

  const handleNewGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetGame();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>🧠 Memo Bits</Text>
        <Text style={styles.subtitle}>Find all matching pairs!</Text>
      </Animated.View>

      <Animated.View style={[styles.stats, { opacity: fadeAnim }]}>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <GameBoard
          cards={cards}
          onCardPress={handleCardPress}
          disabled={isChecking}
        />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={handleNewGame}
          activeOpacity={0.8}
        >
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
      </Animated.View>

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
