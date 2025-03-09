import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

const AddTimerScreen = ({ navigation, dispatch }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Workout');
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleAdd = () => {
    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration),
      remaining: parseInt(duration),
      category,
      status: 'Paused',
      halfwayAlert,
    };
    dispatch({ type: 'ADD_TIMER', payload: newTimer });
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, shadowColor: theme.shadowColor }]}>
      <TextInput
        style={[styles.input, { borderColor: theme.textSecondary, color: theme.text }]}
        placeholder="Timer Name"
        placeholderTextColor={theme.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.textSecondary, color: theme.text }]}
        placeholder="Duration (seconds)"
        placeholderTextColor={theme.textSecondary}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.textSecondary, color: theme.text }]}
        placeholder="Category"
        placeholderTextColor={theme.textSecondary}
        value={category}
        onChangeText={setCategory}
      />
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: theme.text }]}>Halfway Alert</Text>
        <Switch value={halfwayAlert} onValueChange={setHalfwayAlert} />
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
  },
  // eslint-disable-next-line react-native/no-color-literals
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
    padding: 12,
  },
  switchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
  },
});

export default AddTimerScreen;