// // src/context/TimerContext.js
// import React, { createContext, useEffect, useReducer } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const TimerContext = createContext();

// const timerReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TIMER':
//       return [...state, action.payload];
//     case 'UPDATE_TIMER':
//       return state.map(timer =>
//         timer.id === action.payload.id ? { ...timer, ...action.payload } : timer
//       );
//     case 'DELETE_TIMER':
//       return state.filter(timer => timer.id !== action.payload);
//     case 'SET_TIMERS':
//       return action.payload;
//     default:
//       return state;
//   }
// };


// export const TimerProvider = ({ children }) => {
//   const [timers, dispatch] = useReducer(timerReducer, []);

//   useEffect(() => {
//     const loadTimers = async () => {
//       try {
//         const storedTimers = await AsyncStorage.getItem('timers');
//         if (storedTimers) {
//           dispatch({ type: 'SET_TIMERS', payload: JSON.parse(storedTimers) });
//         }
//       } catch (error) {
//         console.error('Failed to load timers:', error);
//       }
//     };

//     loadTimers();
//   }, []);

//   useEffect(() => {
//     const saveTimers = async () => {
//       try {
//         await AsyncStorage.setItem('timers', JSON.stringify(timers));
//       } catch (error) {
//         console.error('Failed to save timers:', error);
//       }
//     };

//     saveTimers();
//   }, [timers]);

//   const addTimer = (timer) => {
//     dispatch({ type: 'ADD_TIMER', payload: { ...timer, id: Date.now() } });
//   };

//   const updateTimer = (timer) => {
//     dispatch({ type: 'UPDATE_TIMER', payload: timer });
//   };

//   const deleteTimer = (id) => {
//     dispatch({ type: 'DELETE_TIMER', payload: id });
//   };

//   return (
//     <TimerContext.Provider value={{ timers, addTimer, updateTimer, deleteTimer }}>
//       {children}
//     </TimerContext.Provider>
//   );
// };


import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TimerContext = createContext();

// Reducer for timers
const timerReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TIMER':
      return [...state, action.payload];
    case 'UPDATE_TIMER':
      return state.map(timer =>
        timer.id === action.payload.id ? { ...timer, ...action.payload } : timer
      );
    case 'DELETE_TIMER':
      return state.filter(timer => timer.id !== action.payload);
    case 'SET_TIMERS':
      return action.payload;
    default:
      return state;
  }
};

// Reducer for history
const historyReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_HISTORY':
      return [...state, action.payload];
    case 'CLEAR_HISTORY':
      return [];
    case 'SET_HISTORY':
      return action.payload;
    default:
      return state;
  }
};

export const TimerProvider = ({ children }) => {
  const [timers, dispatchTimers] = useReducer(timerReducer, []);
  const [history, dispatchHistory] = useReducer(historyReducer, []);

  // Load timers and history from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load timers
        const storedTimers = await AsyncStorage.getItem('timers');
        if (storedTimers) {
          dispatchTimers({ type: 'SET_TIMERS', payload: JSON.parse(storedTimers) });
        }
        
        // Load history
        const storedHistory = await AsyncStorage.getItem('timerHistory');
        if (storedHistory) {
          dispatchHistory({ type: 'SET_HISTORY', payload: JSON.parse(storedHistory) });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  // Save timers when updated
  useEffect(() => {
    const saveTimers = async () => {
      try {
        await AsyncStorage.setItem('timers', JSON.stringify(timers));
      } catch (error) {
        console.error('Failed to save timers:', error);
      }
    };

    saveTimers();
  }, [timers]);

  // Save history when updated
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem('timerHistory', JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    };

    saveHistory();
  }, [history]);

  // Timer actions
  const addTimer = (timer) => {
    dispatchTimers({ type: 'ADD_TIMER', payload: { ...timer, id: Date.now() } });
  };

  const updateTimer = (timer) => {
    dispatchTimers({ type: 'UPDATE_TIMER', payload: timer });
  };

  const deleteTimer = (id) => {
    dispatchTimers({ type: 'DELETE_TIMER', payload: id });
  };

  // History actions
  const addHistory = (entry) => {
    dispatchHistory({ type: 'ADD_HISTORY', payload: { ...entry, id: Date.now() } });
  };

  const clearHistory = () => {
    dispatchHistory({ type: 'CLEAR_HISTORY' });
  };

  return (
    <TimerContext.Provider value={{ 
      timers, 
      addTimer, 
      updateTimer, 
      deleteTimer,
      history,
      addHistory,
      clearHistory
    }}>
      {children}
    </TimerContext.Provider>
  );
};