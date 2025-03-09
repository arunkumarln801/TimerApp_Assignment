// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import Slapscreen from './src/screens/SlapScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { TimerProvider } from './src/context/TimerContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <TimerProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Slapscreen">
        <Stack.Screen name="Slapscreen" component={Slapscreen} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TimerProvider>
  );
};

export default App;
