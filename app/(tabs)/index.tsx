import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  }, [fadeAnim, slideAnim]);

  const handleNewGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetGame();
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460']}
      style={styles.gradient}
    >
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
          <View style={styles.statsCard}>
            <Text style={styles.movesLabel}>Moves</Text>
            <Text style={styles.movesText}>{moves}</Text>
          </View>
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
            <LinearGradient
              colors={['#2d8659', '#1a5c3a']}
              style={styles.buttonGradient}
            >
              <Text style={styles.newGameText}>🔄 New Game</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <WinModal
          visible={isWon}
          moves={moves}
          onPlayAgain={resetGame}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
    textShadowColor: 'rgba(45, 134, 89, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#2d8659',
    fontWeight: '600',
    letterSpacing: 1,
  },
  stats: {
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: 'rgba(42, 42, 42, 0.6)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(45, 134, 89, 0.3)',
    alignItems: 'center',
    minWidth: 120,
  },
  movesLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  movesText: {
    fontSize: 32,
    color: '#2d8659',
    fontWeight: 'bold',
  },
  newGameButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#2d8659',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  newGameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
