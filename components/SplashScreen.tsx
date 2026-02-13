import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Logo rotates slightly
      Animated.spring(rotateAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      // Cards flip in sequence
      Animated.stagger(100, [
        Animated.spring(card1Anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(card2Anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(card3Anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(card4Anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Hold for a moment
      Animated.delay(400),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    sequence.start(() => {
      onFinish();
    });

    return () => {
      sequence.stop();
    };
  }, [card1Anim, card2Anim, card3Anim, card4Anim, fadeAnim, onFinish, rotateAnim, scaleAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const getCardRotation = (anim: Animated.Value) => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { rotate }],
            },
          ]}
        >
          <Text style={styles.emoji}>🧠</Text>
          <Text style={styles.title}>Memo Bits</Text>
          <Text style={styles.subtitle}>Memory Game</Text>

          <View style={styles.cardsContainer}>
            <Animated.View
              style={[
                styles.miniCard,
                {
                  transform: [{ rotateY: getCardRotation(card1Anim) }],
                },
              ]}
            >
              <Text style={styles.miniEmoji}>🎮</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.miniCard,
                {
                  transform: [{ rotateY: getCardRotation(card2Anim) }],
                },
              ]}
            >
              <Text style={styles.miniEmoji}>🚀</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.miniCard,
                {
                  transform: [{ rotateY: getCardRotation(card3Anim) }],
                },
              ]}
            >
              <Text style={styles.miniEmoji}>💾</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.miniCard,
                {
                  transform: [{ rotateY: getCardRotation(card4Anim) }],
                },
              ]}
            >
              <Text style={styles.miniEmoji}>🔥</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(45, 134, 89, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#2d8659',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  cardsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 12,
  },
  miniCard: {
    width: 50,
    height: 50,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2d8659',
  },
  miniEmoji: {
    fontSize: 24,
  },
});
