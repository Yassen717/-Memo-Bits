import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WinModalProps {
  visible: boolean;
  moves: number;
  onPlayAgain: () => void;
}

export default function WinModal({ visible, moves, onPlayAgain }: WinModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🎉 You Won! 🎉</Text>
          <Text style={styles.moves}>
            Completed in {moves} moves
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onPlayAgain}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  moves: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 24,
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
