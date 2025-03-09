// src/components/AddTimerModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const AddTimerModal = ({ isVisible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Workout'); // Default category

  const handleSave = () => {
    if (name && duration && category) {
      onSave({ name, duration: parseInt(duration, 10), category });
      setName('');
      setDuration('');
      setCategory('Workout'); // Reset to default
      onClose();
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Timer</Text>
          <TextInput
            style={styles.input}
            placeholder="Timer Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (seconds)"
            keyboardType="number-pad"
            value={duration}
            onChangeText={setDuration}
          />
          <View style={styles.pickerContainer}>
            <Text>Category:</Text>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setCategory(itemValue)
              }>
              <Picker.Item label="Workout" value="Workout" />
              <Picker.Item label="Study" value="Study" />
              <Picker.Item label="Break" value="Break" />
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="#9b32a8" />
            <Button title="Save" onPress={handleSave} color="#9b32a8" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#9b32a8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    width: '75%',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default AddTimerModal;
