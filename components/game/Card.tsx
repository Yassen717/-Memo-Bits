import { Card as CardType } from '@/types/game';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  card: CardType;
  onPress: (id: number) => void;
  disabled: boolean;
}

export default function Card({ card, onPress, disabled }: CardProps) {
  const showFace = card.isFlipped || card.isMatched;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const matchAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: showFace ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [flipAnim, showFace]);

  useEffect(() => {
    if (card.isMatched) {
      Animated.sequence([
        Animated.spring(matchAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 100,
          friction: 3,
        }),
        Animated.spring(matchAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
      ]).start();
    }
  }, [card.isMatched, matchAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
    ]).start();

    onPress(card.id);
  };

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || card.isMatched}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { rotateY },
              { scale: Animated.multiply(scaleAnim, matchAnim) },
            ],
          },
        ]}
      >
        <Animated.View style={[styles.cardFace, styles.cardBack, { opacity: backOpacity }]}>
          <Text style={styles.questionMark}>?</Text>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            card.isMatched && styles.cardMatched,
            { opacity: frontOpacity },
          ]}
        >
          <Text style={styles.emoji}>{card.emoji}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 70,
    height: 70,
    margin: 4,
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  cardFront: {
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
  questionMark: {
    fontSize: 32,
    color: '#666',
    fontWeight: 'bold',
  },
});
