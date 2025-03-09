import React, { useEffect } from 'react';
import { View, StyleSheet, Image, StatusBar,Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function SlapScreen({ navigation }) {
 useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
    return () => clearTimeout(timer);
  });
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="black" />
      <View style={styles.container}>
          <Image
            source={require('../../assets/images1.jpg')}
            resizeMode="cover"
            style={styles.image}
          />
          <Text style={{color:"#9b32a8",fontSize:20,fontWeight:"800"}}>TIMER APP</Text>
      </View>
    </SafeAreaView>
  );
}

export default SlapScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  img: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 300,
  },
});
