import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

interface WinModalProps {
  visible: boolean;
  moves: number;
  bestScore: number | null;
  isNewRecord: boolean;
  onPlayAgain: () => void;
}

export default function WinModal({ visible, moves, bestScore, isNewRecord, onPlayAgain }: WinModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const recordAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Animate record badge if new record
        if (isNewRecord) {
          Animated.sequence([
            Animated.spring(recordAnim, {
              toValue: 1.2,
              useNativeDriver: true,
              tension: 100,
              friction: 3,
            }),
            Animated.spring(recordAnim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 50,
              friction: 5,
            }),
          ]).start();
        }
      });
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      recordAnim.setValue(0);
    }
  }, [fadeAnim, scaleAnim, recordAnim, visible, isNewRecord]);

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlayAgain();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>🎉 You Won! 🎉</Text>
          
          {isNewRecord && (
            <Animated.View
              style={[
                styles.recordBadge,
                {
                  transform: [{ scale: recordAnim }],
                },
              ]}
            >
              <Text style={styles.recordText}>🏆 NEW RECORD! 🏆</Text>
            </Animated.View>
          )}
          
          <Text style={styles.moves}>
            Completed in {moves} moves
          </Text>
          
          {bestScore !== null && !isNewRecord && (
            <Text style={styles.bestScore}>
              Best: ⭐ {bestScore} moves
            </Text>
          )}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handlePlayAgain}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2d8659',
    minWidth: 280,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  recordBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffd700',
    marginBottom: 16,
  },
  recordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
    letterSpacing: 1,
  },
  moves: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 8,
  },
  bestScore: {
    fontSize: 16,
    color: '#ffd700',
    marginBottom: 24,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2d8659',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
