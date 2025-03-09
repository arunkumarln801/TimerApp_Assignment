import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

const CompletionModal = ({ visible, timer, onClose }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.modalContainer, { shadowColor: theme.shadowColor }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.accent }]}>Timer Completed!</Text>
          <Text style={[styles.modalText, { color: theme.text }]}>
            Congratulations, &quot;{timer?.name}&quot; has finished!
          </Text>
          <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.accent }]} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalButton: {
    borderRadius: 8,
    padding: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CompletionModal;