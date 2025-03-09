
import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Animated,
  Easing
} from 'react-native';
import { TimerContext } from '../context/TimerContext';

const TimerCard = ({ timer, onEdit }) => {
  const { updateTimer, deleteTimer, addHistory } = useContext(TimerContext);
  const [remainingTime, setRemainingTime] = useState(timer.duration);
  const [isRunning, setIsRunning] = useState(false);
  const alertShownRef = useRef(false);
  
  // Animation values
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const buttonPressAnim = useRef(new Animated.Value(1)).current;

  // Handle initial card animation
  useEffect(() => {
    Animated.spring(cardScaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  // Update progress animation when progress changes
  useEffect(() => {
    const progress = timer.duration === 0 ? 0 : ((timer.duration - remainingTime) / timer.duration);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false // Progress width can't use native driver
    }).start();
  }, [remainingTime, timer.duration]);

  useEffect(() => {
    let intervalId;

    if (isRunning && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && remainingTime === 0) {
      clearInterval(intervalId);
      setIsRunning(false);
      
      // Only show alert and add to history if it hasn't been shown yet for this completion
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        
        // Add to history when timer completes
        addHistory({
          timerId: timer.id,
          timerName: timer.name,
          category: timer.category,
          duration: timer.duration,
          completedAt: new Date().toISOString(),
        });
        
        Alert.alert("Timer Complete", `${timer.name} timer has finished!`);
      }
    }

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [isRunning, remainingTime, timer, addHistory]);

  // Reset the alert flag when timer is reset
  useEffect(() => {
    if (remainingTime === timer.duration) {
      alertShownRef.current = false;
    }
  }, [remainingTime, timer.duration]);

  useEffect(() => {
    // Update remaining time when timer is edited
    setRemainingTime(timer.duration);
    resetTimer();
  }, [timer.duration]);

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonPressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(buttonPressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const startTimer = () => {
    animateButtonPress();
    setIsRunning(true);
  };

  const pauseTimer = () => {
    animateButtonPress();
    setIsRunning(false);
  };

  const resetTimer = () => {
    animateButtonPress();
    setIsRunning(false);
    setRemainingTime(timer.duration);
    alertShownRef.current = false; // Reset the alert flag
  };

  const handleEdit = () => {
    animateButtonPress();
    onEdit(timer);
  };

  const handleDelete = () => {
    animateButtonPress();
    Alert.alert(
      "Delete Timer",
      `Are you sure you want to delete "${timer.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteTimer(timer.id), style: "destructive" }
      ]
    );
  };

  const progress = timer.duration === 0 ? 0 : ((timer.duration - remainingTime) / timer.duration) * 100;
  
  // Interpolate progress width for animation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <Animated.View 
      style={[
        styles.card,
        { transform: [{ scale: cardScaleAnim }] }
      ]}
    >
      <Text style={styles.title}>{timer.name}</Text>
      <Text style={styles.subtitle}>Remaining: {formatTime(remainingTime)}</Text>
      <Text style={styles.subtitle}>Status: {isRunning ? 'Running' : 'Paused'}</Text>
      
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { width: progressWidth }
          ]} 
        />
        <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRunning ? styles.disabledButton : null]} 
          onPress={startTimer}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, !isRunning ? styles.disabledButton : null]} 
          onPress={pauseTimer}
          disabled={!isRunning}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleEdit}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Helper function to format seconds into mm:ss
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#3a3a3a',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#222222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#333333',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#9b32a8',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 2,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#9b32a8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6b2275',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#e24a4a',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TimerCard;