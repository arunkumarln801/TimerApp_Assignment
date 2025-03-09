// // src/screens/HomeScreen.js
// import React, { useState, useContext } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import AddTimerModal from '../components/AddTimerModal';
// import TimerCard from '../components/TimerCard';
// import { TimerContext } from '../context/TimerContext';

// const HomeScreen = ({navigation}) => {
//   const { timers, addTimer, updateTimer } = useContext(TimerContext);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const groupedTimers = timers.reduce((acc, timer) => {
//     if (!acc[timer.category]) {
//       acc[timer.category] = [];
//     }
//     acc[timer.category].push(timer);
//     return acc;
//   }, {});

//   const toggleModal = () => {
//     setIsModalVisible(!isModalVisible);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
//         <Text style={styles.addButtonText}>Add Timer</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.addButton} onPress={()=>navigation.navigate("History")}>
//         <Text style={styles.addButtonText}>History</Text>
//       </TouchableOpacity>
//       <AddTimerModal isVisible={isModalVisible} onClose={toggleModal} onSave={addTimer} />

//       <FlatList
//         data={Object.entries(groupedTimers)}
//         keyExtractor={(item) => item[0]}
//         renderItem={({ item }) => {
//           const category = item[0];
//           const timersInCategory = item[1];

//           return (
//             <View style={styles.categoryContainer}>
//               <Text style={styles.categoryTitle}>{category}</Text>
//               {timersInCategory.map((timer) => (
//                 <TimerCard key={timer.id} timer={timer} updateTimer={updateTimer} />
//               ))}
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: 'black',
//   },
//   addButton: {
//     backgroundColor: '#9b32a8',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize:15,
//     fontWeight:"800"
//   },
//   categoryContainer: {
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//   },
//   categoryTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
// });

// export default HomeScreen;


import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Easing,
  ScrollView
} from 'react-native';
import AddTimerModal from '../components/AddTimerModal';
import EditTimerModal from '../components/EditTimerModal';
import TimerCard from '../components/TimerCard';
import { TimerContext } from '../context/TimerContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const { timers, addTimer, updateTimer } = useContext(TimerContext);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Animation values
  const addButtonAnim = useRef(new Animated.Value(0)).current;
  const historyButtonAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(addButtonAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.back(1.5),
        useNativeDriver: true
      }),
      Animated.timing(historyButtonAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.back(1.5),
        useNativeDriver: true
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  // Group timers by category
  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) {
      acc[timer.category] = [];
    }
    acc[timer.category].push(timer);
    return acc;
  }, {});

  // Set initial active category if none is selected
  useEffect(() => {
    if (activeCategory === null && Object.keys(groupedTimers).length > 0) {
      setActiveCategory(Object.keys(groupedTimers)[0]);
    }
  }, [groupedTimers, activeCategory]);

  const toggleAddModal = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(addButtonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(addButtonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    setIsAddModalVisible(!isAddModalVisible);
  };

  const toggleEditModal = (timer = null) => {
    setCurrentTimer(timer);
    setIsEditModalVisible(!isEditModalVisible);
  };

  const handleEditTimer = (updatedTimer) => {
    updateTimer(updatedTimer);
  };

  const navigateToHistory = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(historyButtonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(historyButtonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    navigation.navigate("History");
  };

  const switchCategory = (category) => {
    // Animate content change
    Animated.sequence([
      Animated.timing(contentAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }),
    ]).start(() => {
      setActiveCategory(category);
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true
      }).start();
    });
  };

  const addButtonStyle = {
    transform: [
      { scale: addButtonAnim },
      { translateY: addButtonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0]
      }) }
    ]
  };

  const historyButtonStyle = {
    transform: [
      { scale: historyButtonAnim },
      { translateY: historyButtonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0]
      }) }
    ]
  };

  const contentStyle = {
    opacity: contentAnim,
    transform: [{
      translateY: contentAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0]
      })
    }]
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Timers</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.buttonWrapper, addButtonStyle]}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={toggleAddModal}
            activeOpacity={0.8}
          >
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.buttonText}>Add Timer</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.buttonWrapper, historyButtonStyle]}>
          <TouchableOpacity 
            style={styles.historyButton} 
            onPress={navigateToHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.historyIcon}>⏱</Text>
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <AddTimerModal 
        isVisible={isAddModalVisible} 
        onClose={toggleAddModal} 
        onSave={addTimer} 
      />
      
      {currentTimer && (
        <EditTimerModal
          isVisible={isEditModalVisible}
          onClose={() => toggleEditModal()}
          onSave={handleEditTimer}
          timer={currentTimer}
        />
      )}

      {/* Category Tabs */}
      {Object.keys(groupedTimers).length > 0 && (
        <View style={styles.categoryTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.keys(groupedTimers).map(category => (
              <TouchableOpacity 
                key={category}
                style={[
                  styles.categoryTab,
                  activeCategory === category && styles.activeTab
                ]}
                onPress={() => switchCategory(category)}
              >
                <Text 
                  style={[
                    styles.categoryTabText,
                    activeCategory === category && styles.activeTabText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
      )}

      {/* Current Category Content */}
      {activeCategory && (
        <Animated.View style={[styles.contentContainer, contentStyle]}>
          <Text style={styles.categoryTitle}>{activeCategory}</Text>
          <FlatList
            data={groupedTimers[activeCategory] || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TimerCard 
                timer={item} 
                onEdit={() => toggleEditModal(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.timersList}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonWrapper: {
    width: '48%',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#9b32a8',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#3282a8',
  },
  plusIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  historyIcon: {
    fontSize: 20,
    fontWeight:"900",
    marginRight: 8,
    color:"white"
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "800",
  },
  categoryTabs: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  activeTab: {
    backgroundColor: '#9b32a8',
    borderColor: '#cf50e5',
  },
  categoryTabText: {
    color: '#e0e0e0',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  timersList: {
    paddingBottom: 20,
  },
});

export default HomeScreen;